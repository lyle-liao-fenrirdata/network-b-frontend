import { CheckloadedStuff } from "@/fakeData/C_PageData";
import ChartContainer from "../ChartContainer";
import RecursiveTable from "../RecursiveTable";

interface SignalTypeProp {
  signalType: CheckloadedStuff["argument"] | undefined;
}

const SignalType = ({ signalType }: SignalTypeProp) => (
  <ChartContainer title={<>Signal Type</>}>
    {signalType ? (
      <RecursiveTable
        th={["Parameter", "Current Value"]}
        tr={
          signalType && {
            "Signal Type": [signalType.loadedSignalType],
            Deframer: [signalType.loadedDeframerName],
          }
        }
      />
    ) : (
      <>No Data</>
    )}
  </ChartContainer>
);

export default SignalType;
