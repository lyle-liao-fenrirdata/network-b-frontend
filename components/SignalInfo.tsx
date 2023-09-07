import { Fragment, ReactElement, useState } from "react";
import SignalType from "./app/SignalType";
import EgressStatus from "./app/EgressStatus";
import SignalConfiguration from "./app/SignalConfiguration";
import {
  CEgressPageData,
  CSignalPageDataMux,
  CheckloadedStuff,
  SignalTableRender,
} from "@/fakeData/C_PageData";

interface ContainerProps {
  children: ReactElement;
}

const SignalInfo = () => {
  const [modemIp, setModemIp] = useState("");
  const [signalPageDataSignalType, setSignalPageDataSignalType] = useState<
    CheckloadedStuff["argument"] | undefined
  >(undefined);
  const [egressPageData, setEgressPageData] = useState<CEgressPageData | null>(
    null
  );
  const [
    signalPageDataSignalConfiguration,
    setSignalPageDataSignalConfiguration,
  ] = useState<SignalTableRender["argument"] | undefined>(undefined);

  console.group("Rendering again ====");
  console.info({
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
    reqUrl.searchParams.append("modemIp", modemIp);
    reqUrl.searchParams.append("username", "sfuser");
    reqUrl.searchParams.append("date", Date.now().toString());

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
    reqUrl.searchParams.append("modemIp", modemIp);
    reqUrl.searchParams.append("username", "sfuser");
    reqUrl.searchParams.append("date", Date.now().toString());

    const response = await fetch(reqUrl);
    if (response.ok) {
      const result = (await response.json()) as CEgressPageData;
      setEgressPageData(result);
    } else {
      const error = await response.text();
      console.error(error);
    }
  }

  return (
    <Fragment>
      <div className="flex flex-row gap-2 pb-4">
        <div className="flex w-full max-w-2xl flex-row flex-nowrap items-center justify-start gap-2">
          <span className="min-w-[256px] whitespace-nowrap">
            Search Modem Information By Ip
          </span>
          <input
            type="text"
            id="modemIp"
            name="modemIp"
            value={modemIp}
            onChange={(e) => {
              setModemIp(e.target.value);
              if (signalPageDataSignalType)
                setSignalPageDataSignalType(undefined);
              if (signalPageDataSignalConfiguration)
                setSignalPageDataSignalConfiguration(undefined);
              if (egressPageData) setEgressPageData(null);
            }}
            className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 outline-none"
          />
        </div>
        <button
          className="shrink-0 rounded border-none bg-transparent px-4 py-2 font-bold text-slate-500 outline-none transition-all hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            getSignalPageData();
            getEgressPageData();
          }}
        >
          查詢
        </button>
      </div>
      <div className="mt-4 flex flex-wrap">
        <div className="w-full lg:w-6/12 lg:pr-6">
          <SignalType signalType={signalPageDataSignalType} />
        </div>
        <div className="w-full lg:w-6/12">
          <EgressStatus table={egressPageData?.table} />
        </div>
      </div>
      <SignalConfiguration table={signalPageDataSignalConfiguration} />
    </Fragment>
  );
};

export default SignalInfo;
