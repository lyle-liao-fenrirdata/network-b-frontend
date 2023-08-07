import {
  CEgressPageData,
  CsignalPageDataMux,
  bodyForm,
  restfullAPI,
} from "@/fakeData/C_PageData";
import { ReactElement, useEffect, useState } from "react";

const ChartContainer = ({
  title,
  children,
}: {
  title: JSX.Element;
  children: ReactElement;
}) => (
  <div className="relative mb-6 h-[calc(100%-1.5rem)] w-full break-words rounded bg-white shadow-lg">
    <div className="w-full overflow-x-auto p-4">
      <span className="text-md min-w-48 absolute -left-2 -top-4 inline-block rounded bg-slate-600 px-2 py-1 font-semibold text-white drop-shadow-lg">
        {title}
      </span>
      {children}
    </div>
  </div>
);

type ValueOf<T> = T[keyof T];
type EgressEnabled = "egressEnabled";
type EgressEnabledGroup =
  | `${EgressEnabled}1`
  | `${EgressEnabled}2`
  | `${EgressEnabled}3`
  | `${EgressEnabled}4`;
type EgressProtocal = "egressProtocal";
type EgressProtocalGroup =
  | `${EgressProtocal}1`
  | `${EgressProtocal}2`
  | `${EgressProtocal}3`
  | `${EgressProtocal}4`;
type EgressEncapsulation = "egressEncapsulation";
type EgressEncapsulationGroup =
  | `${EgressEncapsulation}1`
  | `${EgressEncapsulation}2`
  | `${EgressEncapsulation}3`
  | `${EgressEncapsulation}4`;
type EgressServerMode = "egressServerMode";
type EgressServerModeGroup =
  | `${EgressServerMode}1`
  | `${EgressServerMode}2`
  | `${EgressServerMode}3`
  | `${EgressServerMode}4`;
type EgressDestIp = "egressDestIp";
type EgressDestIpGroup =
  | `${EgressDestIp}1`
  | `${EgressDestIp}2`
  | `${EgressDestIp}3`
  | `${EgressDestIp}4`;
type EgressDestPort = "egressDestPort";
type EgressDestPortGroup =
  | `${EgressDestPort}1`
  | `${EgressDestPort}2`
  | `${EgressDestPort}3`
  | `${EgressDestPort}4`;
type EgressOtherGroup = "modemIp" | "username" | "XXesh" | "button";
type BodyForm = typeof bodyForm;

const RecursiveTable = ({
  th,
  tr = { "No Data": [] },
}: {
  th: string[];
  tr?: { [key: string]: any[] };
}) => {
  const keyValueArray = Object.entries<ValueOf<typeof tr>>(tr);
  return (
    <table className="w-full border-collapse items-center bg-transparent">
      <thead>
        <tr>
          {th.map((h) => (
            <th
              key={h}
              className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {keyValueArray.map(([key, value]) => (
          <tr key={key}>
            <th className="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs font-bold text-slate-600">
              {key}
            </th>
            {value.map((v, ind) => (
              <td
                key={`${key}-${v}-${ind}`}
                className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs"
              >
                {v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function Dashboard() {
  const [form, setForm] = useState<BodyForm>(bodyForm);

  const signalType = CsignalPageDataMux.functions.find(
    (f) => f.name === "checkloadedStuff"
  )?.argument;

  const signalConfiguration = CsignalPageDataMux.functions.find(
    (f) => f.name === "signalTableRender"
  )?.argument;

  const [
    cEgressPageData1,
    cEgressPageData2,
    cEgressPageData3,
    cEgressPageData4,
  ] = CEgressPageData.table;
  const cEgressPageDataTh = ["Parameter", "Current Value", "New Value"];
  const cEgressPageDataTr = (
    ct: (typeof CEgressPageData.table)[number],
    options: {
      set: typeof updateForm;
      status: EgressEnabledGroup;
      protocal: EgressProtocalGroup;
      encapsulation: EgressEncapsulationGroup;
      mode: EgressServerModeGroup;
      ip: EgressDestIpGroup;
      port: EgressDestPortGroup;
    }
  ) => {
    return {
      "Current Status": [
        ct.status,
        <select
          name={options.status}
          value={form[options.status]}
          onChange={(e) => options.set(options.status, e.target.value)}
        >
          <option value="0">Enable</option>
          <option value="1">Disable</option>
        </select>,
      ],
      "Transport Protocol": [
        ct.protocol,
        <select
          name={options.protocal}
          value={form[options.protocal]}
          onChange={(e) => options.set(options.protocal, e.target.value)}
        >
          <option value="0">TCP</option>
          <option value="1">???</option>
        </select>,
      ],
      "Encapsulation Type": [
        ct.encapsulation,
        <select
          name={options.encapsulation}
          value={form[options.encapsulation]}
          onChange={(e) => options.set(options.encapsulation, e.target.value)}
        >
          <option value="0">RAW</option>
          <option value="1">???</option>
        </select>,
      ],
      "Connection Mode": [
        ct.mode,
        <select
          name={options.mode}
          value={form[options.mode]}
          onChange={(e) => options.set(options.mode, e.target.value)}
        >
          <option value="0">Client</option>
          <option value="1">???</option>
        </select>,
      ],
      "Server Ip": [
        ct.ip,
        <input
          type="text"
          name={options.ip}
          value={form[options.ip]}
          onChange={(e) => options.set(options.ip, e.target.value)}
        ></input>,
      ],
      "Server Port": [
        ct.port,
        <input
          type="text"
          name={options.port}
          value={form[options.port]}
          onChange={(e) => options.set(options.port, e.target.value)}
        ></input>,
      ],
    };
  };

  function updateForm(key: keyof BodyForm, value: string) {
    setForm((v) => ({ ...v, [key]: value }));
  }

  const acceptUrl = (process.env.NEXT_PUBLIC_BACKEND_ACCEPT_URL ?? "").split(
    ","
  );

  function isAcceptUrl(url: string) {
    return acceptUrl.some((au) => url.startsWith(au));
  }

  async function postBackend1(data: typeof restfullAPI) {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}${process.env.NEXT_PUBLIC_BACKEND_CAPTURE_PATH}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    console.log(result);
  }

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
            <ChartContainer title={<>Signal Type</>}>
              <RecursiveTable
                th={["Parameter", "Current Value"]}
                tr={
                  signalType && {
                    "Signal Type": [signalType.loadedSignalType],
                    Deframer: [signalType.loadedDeframerName],
                  }
                }
              />
            </ChartContainer>
          </div>
          <div className="w-full lg:w-6/12">
            <ChartContainer title={<>Egress Status</>}>
              {/* <>Pending</> */}
              <RecursiveTable
                th={["Egress Channel", "Status"]}
                tr={CEgressPageData.table.reduce(
                  (prev, curr, ind) => ({
                    ...prev,
                    [`channel ${ind + 1}`]: [curr.status],
                  }),
                  {}
                )}
              />
            </ChartContainer>
          </div>
        </div>
        <ChartContainer title={<>Signal Configuration</>}>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 lg:pr-6">
              <RecursiveTable
                th={["Parameter", "Current Value"]}
                tr={
                  signalConfiguration && {
                    "System RFID": [signalConfiguration.sfSystemRfid],
                    "Sub Channel Case Notation": [
                      signalConfiguration.sfdbSubChannelCaseNotation,
                    ],
                    "Sub Channel Status": [
                      signalConfiguration.sfdbSubChannelInUse === "1"
                        ? "In-Use"
                        : "Unknow",
                    ],
                    "L Band Frequency": [signalConfiguration.lBandFrequency],
                    "Off Air Frequency": [
                      signalConfiguration.sfOffAirFrequency,
                    ],
                    "Down Conversion Factor": [
                      signalConfiguration.sfDownConversionFactor,
                    ],
                    "Baud Rate": [signalConfiguration.sfBaudRate],
                  }
                }
              />
            </div>
            <div className="w-full lg:w-6/12">
              <RecursiveTable
                th={["Parameter", "Current Value"]}
                tr={
                  signalConfiguration && {
                    "Pls Signature": [signalConfiguration.sfPlsSignature],
                    "Power Mode": [signalConfiguration.sfPowerMode],
                    Derandomiser: [signalConfiguration.sfDerandomiserEnable],
                    "Error Frequency Offset": [
                      signalConfiguration.sfFrequencyError,
                    ],
                    "Input Level": [signalConfiguration.sfInputLevel],
                    "Cluster Variance (SNR)": [
                      signalConfiguration.sfClusterVariance,
                    ],
                    "Output Mode": [signalConfiguration.sfOutputMode],
                  }
                }
              />
            </div>
          </div>
        </ChartContainer>
        <ChartContainer title={<>Egress Channels</>}>
          <>
            <div className="block w-full pt-8">
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 lg:pr-6">
                  {Boolean(cEgressPageData1) && (
                    <ChartContainer title={<>Channel 1</>}>
                      <RecursiveTable
                        key={cEgressPageData1.componentId}
                        th={cEgressPageDataTh}
                        tr={cEgressPageDataTr(cEgressPageData1, {
                          set: updateForm,
                          status: "egressEnabled1",
                          protocal: "egressProtocal1",
                          encapsulation: "egressEncapsulation1",
                          mode: "egressServerMode1",
                          ip: "egressDestIp1",
                          port: "egressDestPort1",
                        })}
                      />
                    </ChartContainer>
                  )}
                </div>
                <div className="w-full lg:w-6/12">
                  {Boolean(cEgressPageData2) && (
                    <ChartContainer title={<>Channel 2</>}>
                      <RecursiveTable
                        key={cEgressPageData2.componentId}
                        th={cEgressPageDataTh}
                        tr={cEgressPageDataTr(cEgressPageData2, {
                          set: updateForm,
                          status: "egressEnabled2",
                          protocal: "egressProtocal2",
                          encapsulation: "egressEncapsulation2",
                          mode: "egressServerMode2",
                          ip: "egressDestIp2",
                          port: "egressDestPort2",
                        })}
                      />
                    </ChartContainer>
                  )}
                </div>
              </div>
            </div>
            <div className="block w-full">
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 lg:pr-6">
                  {Boolean(cEgressPageData3) && (
                    <ChartContainer title={<>Channel 3</>}>
                      <RecursiveTable
                        key={cEgressPageData3.componentId}
                        th={cEgressPageDataTh}
                        tr={cEgressPageDataTr(cEgressPageData3, {
                          set: updateForm,
                          status: "egressEnabled3",
                          protocal: "egressProtocal3",
                          encapsulation: "egressEncapsulation3",
                          mode: "egressServerMode3",
                          ip: "egressDestIp3",
                          port: "egressDestPort3",
                        })}
                      />
                    </ChartContainer>
                  )}
                </div>
                <div className="w-full lg:w-6/12">
                  {Boolean(cEgressPageData4) && (
                    <ChartContainer title={<>Channel 4</>}>
                      <RecursiveTable
                        key={cEgressPageData4.componentId}
                        th={cEgressPageDataTh}
                        tr={cEgressPageDataTr(cEgressPageData4, {
                          set: updateForm,
                          status: "egressEnabled4",
                          protocal: "egressProtocal4",
                          encapsulation: "egressEncapsulation4",
                          mode: "egressServerMode4",
                          ip: "egressDestIp4",
                          port: "egressDestPort4",
                        })}
                      />
                    </ChartContainer>
                  )}
                </div>
              </div>
            </div>
            <div className="flex w-full flex-row flex-wrap items-center justify-end gap-2">
              <div className="relative rounded border-0 bg-amber-400 px-3 py-2 text-black">
                <span className="inline-block align-middle">
                  <b className="capitalize">注意!</b>{" "}
                  僅以下IP開頭的位址,會送往擷取系統
                </span>
                {acceptUrl.map((err) => (
                  <p key={err} className="block pl-4 pt-1 text-sm text-red-700">
                    {err}
                  </p>
                ))}
              </div>
              <div></div>
              <button
                disabled={false}
                className="mt-auto rounded bg-slate-800 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-slate-600 disabled:opacity-30"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  postBackend1(restfullAPI);
                }}
              >
                送出變更
              </button>
            </div>
          </>
        </ChartContainer>
      </main>
    </div>
  );
}
