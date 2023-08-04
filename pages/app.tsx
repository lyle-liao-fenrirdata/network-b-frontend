import { CEgressPageData, CsignalPageDataMux } from "@/fakeData/C_PageData";
import { ReactElement } from "react";

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
            <th className="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs font-bold text-slate-600">
              {key}
            </th>
            {value.map((v, ind) => (
              <td
                key={`${key}-${v}-${ind}`}
                className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs"
              >
                {String(v)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function Dashboard() {
  const signalType = CsignalPageDataMux.functions.find(
    (f) => f.name === "checkloadedStuff"
  )?.argument;

  const signalConfiguration = CsignalPageDataMux.functions.find(
    (f) => f.name === "signalTableRender"
  )?.argument;

  return (
    <div className="relative min-h-screen min-w-full bg-slate-100">
      <nav className="relative flex h-16 w-full flex-row flex-nowrap items-center justify-start bg-slate-800 py-4">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between px-4 md:flex-nowrap md:px-10">
          <a href="/" className="text-lg font-semibold text-white">
            訊號分配
          </a>

          {/* <ul className="flex flex-1 list-none flex-row items-center justify-end gap-2">
            <span className="text-lg text-white">username</span>
          </ul> */}
        </div>
      </nav>
      <main className="relative w-full px-4 py-8 md:px-10">
        <div className="flex flex-wrap">
          <div className="w-full md:w-6/12 md:pr-6">
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
          <div className="w-full md:w-6/12">
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
        <div className="flex flex-wrap">
          <div className="w-full md:w-6/12 md:pr-6">
            <ChartContainer title={<>Signal Configuration</>}>
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
            </ChartContainer>
          </div>
          <div className="w-full md:w-6/12">
            <ChartContainer title={<>Egress Channels</>}>
              <>
                {CEgressPageData.table.map((ct) => (
                  <RecursiveTable
                    key={ct.componentId}
                    th={["Parameter", "Current Value", "New Value"]}
                    tr={{
                      currentStatus: [ct.status, "Pending"],
                      transportProtocol: [ct.protocol, "Pending"],
                      encapsulationType: [ct.encapsulation, "Pending"],
                      connectionMode: [ct.mode, "Pending"],
                      serverIp: [ct.ip, "Pending"],
                      serverPort: [ct.port, "Pending"],
                    }}
                  />
                ))}
              </>
            </ChartContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
