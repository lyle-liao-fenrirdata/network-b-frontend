import { CEgressPageData } from "@/fakeData/C_PageData";
import ChartContainer from "../ChartContainer";
import RecursiveTable from "../RecursiveTable";

interface EgressStatusProp {
  table: CEgressPageData["table"] | undefined;
}

const EgressStatus = ({ table }: EgressStatusProp) => (
  <ChartContainer title={<>Egress Status</>}>
    {table ? (
      <RecursiveTable
        th={["Egress Channel", "Status"]}
        tr={table.reduce(
          (prev, curr, ind) => ({
            ...prev,
            [`channel ${ind + 1}`]: [curr.status],
          }),
          {}
        )}
      />
    ) : (
      <>No Data</>
    )}
  </ChartContainer>
);

export default EgressStatus;
