import { CEgressPageData } from "@/fakeData/C_PageData";
import ChartContainer from "../ChartContainer";
import RecursiveTable from "../RecursiveTable";

interface EgressChannelTableProps {
  tables: CEgressPageData["table"] | undefined;
  form: { [key: string]: string };
  updateForm(key: string, value: string, componentId: string): void;
}

interface CEgressPageDataTrProps {
  table: CEgressPageData["table"][number];
  form: EgressChannelTableProps["form"];
  options: {
    set: EgressChannelTableProps["updateForm"];
    status: string;
    protocal: string;
    encapsulation: string;
    mode: string;
    ip: string;
    port: string;
  };
}

const cEgressPageDataTr = ({
  table,
  form,
  options,
}: CEgressPageDataTrProps) => ({
  "Current Status": [
    table.status,
    <select
      name={options.status}
      value={(form && form[options.status]) ?? "-1"}
      onChange={(e) =>
        options.set(options.status, e.target.value, table.componentId)
      }
    >
      <option value="-1">錯誤! 沒有對應值</option>
      <option value="0">Enable</option>
      <option value="1">Disable</option>
    </select>,
  ],
  "Transport Protocol": [
    table.protocol,
    <select
      name={options.protocal}
      value={(form && form[options.protocal]) ?? "-1"}
      onChange={(e) =>
        options.set(options.protocal, e.target.value, table.componentId)
      }
    >
      <option value="-1">錯誤! 沒有對應值</option>
      <option value="0">TCP</option>
      <option value="1">???</option>
    </select>,
  ],
  "Encapsulation Type": [
    table.encapsulation,
    <select
      name={options.encapsulation}
      value={(form && form[options.encapsulation]) ?? "-1"}
      onChange={(e) =>
        options.set(options.encapsulation, e.target.value, table.componentId)
      }
    >
      <option value="-1">錯誤! 沒有對應值</option>
      <option value="0">RAW</option>
      <option value="1">???</option>
    </select>,
  ],
  "Connection Mode": [
    table.mode,
    <select
      name={options.mode}
      value={(form && form[options.mode]) ?? "-1"}
      onChange={(e) =>
        options.set(options.mode, e.target.value, table.componentId)
      }
    >
      <option value="-1">錯誤! 沒有對應值</option>
      <option value="0">Client</option>
      <option value="1">???</option>
    </select>,
  ],
  "Server Ip": [
    table.ip,
    <input
      type="text"
      name={options.ip}
      value={(form && form[options.ip]) ?? "錯誤! 沒有對應值"}
      onChange={(e) =>
        options.set(options.ip, e.target.value, table.componentId)
      }
    ></input>,
  ],
  "Server Port": [
    table.port,
    <input
      type="text"
      name={options.port}
      value={(form && form[options.port]) ?? "錯誤! 沒有對應值"}
      onChange={(e) =>
        options.set(options.port, e.target.value, table.componentId)
      }
    ></input>,
  ],
});

const EgressChannelTable = ({
  tables,
  updateForm,
  form,
}: EgressChannelTableProps) => (
  <div className="block w-full pt-8">
    {tables ? (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {tables.map((table, index) => (
          <ChartContainer
            key={table.componentId}
            title={<>Channel {index + 1}</>}
          >
            <RecursiveTable
              th={["Parameter", "Current Value", "New Value"]}
              tr={cEgressPageDataTr({
                table,
                form,
                options: {
                  set: updateForm,
                  status: `egressEnabled${index + 1}`,
                  protocal: `egressProtocal${index + 1}`,
                  encapsulation: `egressEncapsulation${index + 1}`,
                  mode: `egressServerMode${index + 1}`,
                  ip: `egressDestIp${index + 1}`,
                  port: `egressDestPort${index + 1}`,
                },
              })}
            />
          </ChartContainer>
        ))}
      </div>
    ) : (
      <>No Data</>
    )}
  </div>
);

export default EgressChannelTable;
