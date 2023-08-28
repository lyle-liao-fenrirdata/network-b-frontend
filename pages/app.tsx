import {
  CEgressPageData,
  CSignalPageDataMux,
  CheckloadedStuff,
  RestfullAPI,
  SignalTableRender,
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
            <th className="whitespace-nowrap border-none px-6 py-2 text-left align-middle text-xs font-bold text-slate-600">
              {key}
            </th>
            {value.map((v, ind) => (
              <td
                key={`${key}-${v}-${ind}`}
                className="whitespace-nowrap border-none px-6 py-2 align-middle text-xs"
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

const defaultBackendForm = {
  ServerType: "",
  Timestamp: "UnixTime",
  Capture: "",
  RecordID: "",
  ModemDataIP: "",
  ModemDataDestPort: NaN,
  ModemModel: "",
};

export default function Dashboard() {
  const [egressForm, setEgressForm] = useState<{ [key: string]: string }>({});
  const [backendForm, setBackendForm] = useState<RestfullAPI[]>([]);
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

  async function postEgressPageHandler() {
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
    }
  }

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
      setBackendForm(
        Array.from({ length: result?.table?.length ?? 0 }).map(() => ({
          ...defaultBackendForm,
        }))
      );
    } else {
      const error = await response.text();
      console.error(error);
    }
  }

  function cEgressPageDataTr(
    ct: CEgressPageData["table"][number],
    options: {
      set: typeof updateForm;
      status: string;
      protocal: string;
      encapsulation: string;
      mode: string;
      ip: string;
      port: string;
    }
  ) {
    return {
      "Current Status": [
        ct.status,
        <select
          name={options.status}
          value={(egressForm && egressForm[options.status]) ?? "-1"}
          onChange={(e) => options.set(options.status, e.target.value)}
        >
          <option value="-1">錯誤! 沒有對應值</option>
          <option value="0">Enable</option>
          <option value="1">Disable</option>
        </select>,
      ],
      "Transport Protocol": [
        ct.protocol,
        <select
          name={options.protocal}
          value={(egressForm && egressForm[options.protocal]) ?? "-1"}
          onChange={(e) => options.set(options.protocal, e.target.value)}
        >
          <option value="-1">錯誤! 沒有對應值</option>
          <option value="0">TCP</option>
          <option value="1">???</option>
        </select>,
      ],
      "Encapsulation Type": [
        ct.encapsulation,
        <select
          name={options.encapsulation}
          value={(egressForm && egressForm[options.encapsulation]) ?? "-1"}
          onChange={(e) => options.set(options.encapsulation, e.target.value)}
        >
          <option value="-1">錯誤! 沒有對應值</option>
          <option value="0">RAW</option>
          <option value="1">???</option>
        </select>,
      ],
      "Connection Mode": [
        ct.mode,
        <select
          name={options.mode}
          value={(egressForm && egressForm[options.mode]) ?? "-1"}
          onChange={(e) => options.set(options.mode, e.target.value)}
        >
          <option value="-1">錯誤! 沒有對應值</option>
          <option value="0">Client</option>
          <option value="1">???</option>
        </select>,
      ],
      "Server Ip": [
        ct.ip,
        <input
          type="text"
          name={options.ip}
          value={(egressForm && egressForm[options.ip]) ?? "錯誤! 沒有對應值"}
          onChange={(e) => options.set(options.ip, e.target.value)}
        ></input>,
      ],
      "Server Port": [
        ct.port,
        <input
          type="text"
          name={options.port}
          value={(egressForm && egressForm[options.port]) ?? "錯誤! 沒有對應值"}
          onChange={(e) => options.set(options.port, e.target.value)}
        ></input>,
      ],
    };
  }

  function updateForm(key: string, value: string) {
    setEgressForm((v) => ({ ...v, [key]: value }));
  }

  async function postBackend(data: RestfullAPI) {
    const reqUrl = new URL(
      process.env.NEXT_PUBLIC_CAPTURE_COMMAND_PATH as string,
      `${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`
    );
    const response = await fetch(reqUrl, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setSendStatus((prev) => ({ ...prev, backend: true }));
    } else {
      const error = await response.text();
      console.error(error);
    }
  }

  useEffect(() => {
    getEgressPageData();
    getSignalPageData();
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
            <ChartContainer title={<>Signal Type</>}>
              <RecursiveTable
                th={["Parameter", "Current Value"]}
                tr={
                  signalPageDataSignalType && {
                    "Signal Type": [signalPageDataSignalType.loadedSignalType],
                    Deframer: [signalPageDataSignalType.loadedDeframerName],
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
                tr={egressPageData?.table.reduce(
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
                  signalPageDataSignalConfiguration && {
                    "System RFID": [
                      signalPageDataSignalConfiguration.sfSystemRfid,
                    ],
                    "Sub Channel Case Notation": [
                      signalPageDataSignalConfiguration.sfdbSubChannelCaseNotation,
                    ],
                    "Sub Channel Status": [
                      signalPageDataSignalConfiguration.sfdbSubChannelInUse ===
                      "1"
                        ? "In-Use"
                        : "Unknow",
                    ],
                    "L Band Frequency": [
                      signalPageDataSignalConfiguration.lBandFrequency,
                    ],
                    "Off Air Frequency": [
                      signalPageDataSignalConfiguration.sfOffAirFrequency,
                    ],
                    "Down Conversion Factor": [
                      signalPageDataSignalConfiguration.sfDownConversionFactor,
                    ],
                    "Baud Rate": [signalPageDataSignalConfiguration.sfBaudRate],
                  }
                }
              />
            </div>
            <div className="w-full lg:w-6/12">
              <RecursiveTable
                th={["Parameter", "Current Value"]}
                tr={
                  signalPageDataSignalConfiguration && {
                    "Pls Signature": [
                      signalPageDataSignalConfiguration.sfPlsSignature,
                    ],
                    "Power Mode": [
                      signalPageDataSignalConfiguration.sfPowerMode,
                    ],
                    Derandomiser: [
                      signalPageDataSignalConfiguration.sfDerandomiserEnable,
                    ],
                    "Error Frequency Offset": [
                      signalPageDataSignalConfiguration.sfFrequencyError,
                    ],
                    "Input Level": [
                      signalPageDataSignalConfiguration.sfInputLevel,
                    ],
                    "Cluster Variance (SNR)": [
                      signalPageDataSignalConfiguration.sfClusterVariance,
                    ],
                    "Output Mode": [
                      signalPageDataSignalConfiguration.sfOutputMode,
                    ],
                  }
                }
              />
            </div>
          </div>
        </ChartContainer>
        <ChartContainer title={<>Egress Channels</>}>
          <>
            <div className="block w-full pt-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {egressPageData &&
                  egressPageData.table &&
                  egressPageData.table.map((eTable, index) => (
                    <ChartContainer
                      key={eTable.componentId}
                      title={<>Channel {index + 1}</>}
                    >
                      <RecursiveTable
                        th={["Parameter", "Current Value", "New Value"]}
                        tr={cEgressPageDataTr(eTable, {
                          set: updateForm,
                          status: `egressEnabled${index + 1}`,
                          protocal: `egressProtocal${index + 1}`,
                          encapsulation: `egressEncapsulation${index + 1}`,
                          mode: `egressServerMode${index + 1}`,
                          ip: `egressDestIp${index + 1}`,
                          port: `egressDestPort${index + 1}`,
                        })}
                      />
                    </ChartContainer>
                  ))}
                {/* <div className="w-full lg:w-6/12">
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
                </div> */}
              </div>
            </div>
            {/* <div className="block w-full">
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
            </div> */}
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
                disabled={false}
                className="mt-auto rounded bg-slate-800 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-slate-600 disabled:opacity-30"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  postBackend({
                    // LinkID: {
                    //   SatelliteID: "AA",
                    //   Polarization: "V",
                    //   Frequency: 11669000000,
                    // },
                    // InputPort: 1,
                    // OutputPort: 1,
                    // ServerIP: "192.168.016.51",
                    // ServerPort: 5001,
                    // ServerCh: 1,
                    ServerType: "IP",
                    Timestamp: "UnixTime",
                    Capture: "Disable",
                    RecordID: "Testxxx000000",
                    ModemDataIP: "192.168.016.192",
                    ModemDataDestPort: 6001,
                    ModemModel: "MDM9000",
                  });
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
