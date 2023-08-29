import { SignalTableRender } from "@/fakeData/C_PageData";
import ChartContainer from "../ChartContainer";
import RecursiveTable from "../RecursiveTable";

interface SignalConfigurationProps {
  table: SignalTableRender["argument"] | undefined;
}

const SignalConfiguration = ({ table }: SignalConfigurationProps) => (
  <ChartContainer title={<>Signal Configuration</>}>
    {table ? (
      <div className="flex flex-wrap">
        <div className="w-full lg:w-6/12 lg:pr-6">
          <RecursiveTable
            th={["Parameter", "Current Value"]}
            tr={
              table && {
                "System RFID": [table.sfSystemRfid],
                "Sub Channel Case Notation": [table.sfdbSubChannelCaseNotation],
                "Sub Channel Status": [
                  table.sfdbSubChannelInUse === "1" ? "In-Use" : "Unknow",
                ],
                "L Band Frequency": [table.lBandFrequency],
                "Off Air Frequency": [table.sfOffAirFrequency],
                "Down Conversion Factor": [table.sfDownConversionFactor],
                "Baud Rate": [table.sfBaudRate],
              }
            }
          />
        </div>
        <div className="w-full lg:w-6/12">
          <RecursiveTable
            th={["Parameter", "Current Value"]}
            tr={
              table && {
                "Pls Signature": [table.sfPlsSignature],
                "Power Mode": [table.sfPowerMode],
                Derandomiser: [table.sfDerandomiserEnable],
                "Error Frequency Offset": [table.sfFrequencyError],
                "Input Level": [table.sfInputLevel],
                "Cluster Variance (SNR)": [table.sfClusterVariance],
                "Output Mode": [table.sfOutputMode],
              }
            }
          />
        </div>
      </div>
    ) : (
      <>No Data</>
    )}
  </ChartContainer>
);

export default SignalConfiguration;
