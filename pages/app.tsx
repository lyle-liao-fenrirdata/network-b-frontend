import ChartContainer from "@/components/ChartContainer";
import Modal from "@/components/Modal";
import EgressChannelTable from "@/components/app/EgressChannelTable";
import EgressStatus from "@/components/app/EgressStatus";
import ModalExt from "@/components/app/ModalExt";
import SignalConfiguration from "@/components/app/SignalConfiguration";
import SignalType from "@/components/app/SignalType";
import {
  CEgressPageData,
  CSignalPageDataMux,
  CheckloadedStuff,
  RestfullAPI,
  SignalTableRender,
} from "@/fakeData/C_PageData";
import { useEffect, useState } from "react";

interface BackendFormCommon
  extends Omit<RestfullAPI, "ModemDataDestPort" | "ModemDataIP" | "Capture"> {}

interface BackendForms extends Omit<RestfullAPI, keyof BackendFormCommon> {
  componentId: string;
}

export default function Dashboard() {
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [egressForm, setEgressForm] = useState<{ [key: string]: string }>({});
  const [backendFormCommon, setBackendFormCommon] = useState<BackendFormCommon>(
    { ServerType: "", Timestamp: "", RecordID: "", ModemModel: "networkB" }
  );
  const [backendForms, setBackendForms] = useState<BackendForms[]>([]);
  const [egressPageData, setEgressPageData] = useState<CEgressPageData | null>(
    null
  );
  const [signalPageDataSignalType, setSignalPageDataSignalType] = useState<
    CheckloadedStuff["argument"] | undefined
  >(undefined);
  const [
    signalPageDataSignalConfiguration,
    setSignalPageDataSignalConfiguration,
  ] = useState<SignalTableRender["argument"] | undefined>(undefined);
  const [sendStatus, setSendStatus] = useState<{
    egress: boolean | "loading";
    backend: boolean | "loading";
  }>({
    egress: false,
    backend: false,
  });

  console.group("Rendering again ====");
  console.info({
    sendStatus,
    egressForm,
    backendFormCommon,
    backendForms,
    egressPageData,
    signalPageDataSignalType,
    signalPageDataSignalConfiguration,
  });
  console.groupEnd();

  async function getSignalPageData() {
    const reqUrl = new URL(
      process.env.NEXT_PUBLIC_EGRESS_SIGANL_PATH as string,
      `${process.env.NEXT_PUBLIC_EGRESS_URL}:${process.env.NEXT_PUBLIC_EGRESS_PORT}`
    );
    reqUrl.searchParams.append("modemIp", "192.168.1.105");
    reqUrl.searchParams.append("username", "sfuser");
    reqUrl.searchParams.append("date", "1686624786951");

    const response = await fetch(reqUrl);
    if (response.ok) {
      const result = (await response.json()) as CSignalPageDataMux;

      const signalType = result?.functions?.find(
        (f) => f.name === "checkloadedStuff"
      )?.argument as unknown as CheckloadedStuff["argument"] | undefined;

      if (signalType) setSignalPageDataSignalType(signalType);

      const signalConfiguration = result?.functions?.find(
        (f) => f.name === "signalTableRender"
      )?.argument as unknown as SignalTableRender["argument"] | undefined;

      if (signalConfiguration)
        setSignalPageDataSignalConfiguration(signalConfiguration);

      if (signalType && signalConfiguration) {
        setEgressForm((prev) => ({
          ...prev,
          modemIp: "192.168.1.105",
          username: "sfuser",
          XXesh: "",
          button: "Apply",
        }));
        setBackendFormCommon((prev) => ({
          ...prev,
          ServerType: signalType.loadedSignalType ?? "",
          // RecordID: "",
        }));
      }
    } else {
      const error = await response.text();
      console.error(error);
    }
  }

  async function getEgressPageData() {
    const reqUrl = new URL(
      process.env.NEXT_PUBLIC_EGRESS_PAGE_PATH as string,
      `${process.env.NEXT_PUBLIC_EGRESS_URL}:${process.env.NEXT_PUBLIC_EGRESS_PORT}`
    );
    reqUrl.searchParams.append("modemIp", "192.168.1.105");
    reqUrl.searchParams.append("username", "sfuser");
    reqUrl.searchParams.append("date", "1686624786951");

    const response = await fetch(reqUrl);
    if (response.ok) {
      const result = (await response.json()) as CEgressPageData;
      setEgressPageData(result);

      const egressPageDataTable = (result?.table ?? []).sort((a, b) =>
        a.componentId.localeCompare(b.componentId)
      );
      egressPageDataTable.forEach((t, i) => {
        setEgressForm((prev) => ({
          ...prev,
          [`egressEnabled${i + 1}`]: t.enabled === "Enabled" ? "0" : "1",
          [`egressProtocal${i + 1}`]: t.protocol === "TCP" ? "0" : "-1",
          [`egressEncapsulation${i + 1}`]:
            t.encapsulation === "RAW" ? "4" : "0",
          [`egressServerMode${i + 1}`]: t.mode === "Client" ? "0" : "-1",
          [`egressDestIp${i + 1}`]: t.ip ?? "",
          [`egressDestPort${i + 1}`]: t.port ?? "",
        }));
      });
      setBackendForms(
        egressPageDataTable.map((t) => ({
          componentId: t.componentId,
          Capture: t.enabled,
          ModemDataIP: t.ip ?? "",
          ModemDataDestPort: t.port ?? "",
        }))
      );
    } else {
      const error = await response.text();
      console.error(error);
    }
  }

  function updateForm(key: string, value: string, componentId: string) {
    setEgressForm((v) => ({ ...v, [key]: value }));
    console.log(key, value);
    if (key.includes("egressEnabled"))
      setBackendForms((prev) =>
        prev.map((pre) => {
          if (pre.componentId !== componentId) return pre;
          return {
            ...pre,
            Capture: value === "0" ? "Enable" : "Disable",
          };
        })
      );

    if (key.includes("egressDestIp"))
      setBackendForms((prev) =>
        prev.map((pre) => {
          if (pre.componentId !== componentId) return pre;
          return {
            ...pre,
            ModemDataIP: value,
          };
        })
      );

    if (key.includes("egressDestPort"))
      setBackendForms((prev) =>
        prev.map((pre) => {
          if (pre.componentId !== componentId) return pre;
          return {
            ...pre,
            ModemDataDestPort: value,
          };
        })
      );
  }

  async function postBackend() {
    const Timestamp = Math.round(Date.now() / 1000).toString();
    setSendStatus((prev) => ({ ...prev, backend: "loading" }));
    const reqUrl = new URL(
      process.env.NEXT_PUBLIC_CAPTURE_COMMAND_PATH as string,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`
    );
    const responses = await Promise.all(
      backendForms.map(async (form) => {
        const body = {
          Timestamp,
          ServerType: backendFormCommon.ServerType,
          RecordID: backendFormCommon.RecordID,
          ModemModel: backendFormCommon.ModemModel,
          Capture: form.Capture,
          ModemDataIP: form.ModemDataIP,
          ModemDataDestPort: form.ModemDataDestPort,
        };
        return await fetch(reqUrl, {
          method: "POST",
          body: JSON.stringify(body),
        });
      })
    );

    if (responses.every((r) => r.ok)) {
      setSendStatus((prev) => ({ ...prev, backend: true }));
    } else {
      const error = await Promise.all(
        responses.map(async (r) => await r.text())
      );
      console.error(error);
      setSendStatus((prev) => ({ ...prev, backend: false }));
    }
  }

  async function postEgressPageHandler() {
    setSendStatus((prev) => ({ ...prev, egress: "loading" }));
    const reqUrl = new URL(
      process.env.NEXT_PUBLIC_EGRESS_HANDLER_PATH as string,
      `${process.env.NEXT_PUBLIC_EGRESS_URL}:${process.env.NEXT_PUBLIC_EGRESS_PORT}`
    );
    const response = await fetch(reqUrl, {
      method: "POST",
      body: JSON.stringify(egressForm),
    });
    if (response.ok) {
      setSendStatus((prev) => ({ ...prev, egress: true }));
    } else {
      const error = await response.text();
      console.error(error);
      setSendStatus((prev) => ({ ...prev, egress: false }));
    }
  }

  useEffect(() => {
    getSignalPageData();
    getEgressPageData();
  }, []);

  return (
    <div className="relative min-h-screen min-w-full bg-slate-100">
      <nav className="relative flex h-16 w-full flex-row flex-nowrap items-center justify-start bg-slate-800 py-4">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between px-4 lg:flex-nowrap lg:px-10">
          <a href="/" className="text-lg font-semibold text-white">
            訊號分配
          </a>

          {/* <ul className="flex flex-1 list-none flex-row items-center justify-end gap-2">
            <span className="text-lg text-white">username</span>
          </ul> */}
        </div>
      </nav>
      <main className="relative w-full px-4 py-8 lg:px-10">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 lg:pr-6">
            <SignalType signalType={signalPageDataSignalType} />
          </div>
          <div className="w-full lg:w-6/12">
            <EgressStatus table={egressPageData?.table} />
          </div>
        </div>
        <SignalConfiguration table={signalPageDataSignalConfiguration} />
        <ChartContainer title={<>Egress Channels</>}>
          <>
            <EgressChannelTable
              tables={egressPageData?.table}
              updateForm={updateForm}
              form={egressForm}
            />
            <div className="flex w-full flex-row flex-wrap items-center justify-end gap-2">
              {/* <div className="relative rounded border-0 bg-amber-400 px-3 py-2 text-black">
                <span className="inline-block align-middle">
                  <b className="capitalize">注意!</b>{" "}
                  僅以下IP開頭的位址,會送往擷取系統
                </span>
                {acceptUrl.map((err) => (
                  <p key={err} className="block pl-4 pt-1 text-sm text-red-700">
                    {err}
                  </p>
                ))}
              </div> */}
              <button
                disabled={
                  sendStatus.backend === "loading" ||
                  sendStatus.egress === "loading"
                }
                className="mt-auto rounded bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-slate-600 disabled:opacity-30"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSendModalOpen(true);
                  postEgressPageHandler();
                  postBackend();
                }}
              >
                送出變更
              </button>
            </div>
          </>
        </ChartContainer>
      </main>
      {isSendModalOpen && (
        <ModalExt
          header="資料傳送"
          onCloseModal={() => setIsSendModalOpen(false)}
          actions={[
            <button
              key="closeModal"
              className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
              type="button"
              onClick={() => setIsSendModalOpen(false)}
            >
              OK
            </button>,
          ]}
          ths={["傳送對象", "狀態", "傳送內容"]}
        >
          <>
            <tr>
              <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                Egress (原系統)
              </th>
              <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                {!sendStatus.egress
                  ? "❌ 失敗"
                  : sendStatus.egress === "loading"
                  ? "🔜 傳送中..."
                  : "✅ 成功"}
              </td>
              <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                <pre className="max-h-[30vh] overflow-y-scroll">
                  {JSON.stringify(egressForm, undefined, 4)}
                </pre>
              </td>
            </tr>
            <tr>
              <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                後臺系統
              </th>
              <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                {!sendStatus.backend
                  ? "❌ 失敗"
                  : sendStatus.backend === "loading"
                  ? "🔜 傳送中..."
                  : "✅ 成功"}
              </td>
              <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                <pre className="max-h-[30vh] overflow-y-scroll">
                  {JSON.stringify(
                    {
                      ...backendFormCommon,
                      ...backendForms,
                    },
                    undefined,
                    4
                  )}
                </pre>
              </td>
            </tr>
          </>
        </ModalExt>
      )}
    </div>
  );
}
