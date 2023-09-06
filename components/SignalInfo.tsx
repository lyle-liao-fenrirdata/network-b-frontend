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
    } else {
      const error = await response.text();
      console.error(error);
    }
  }

  return (
    <Fragment>
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
