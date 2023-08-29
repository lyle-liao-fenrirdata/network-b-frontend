type ValueOf<T> = T[keyof T];

interface RecursiveTableProps {
  th: string[];
  tr?: { [key: string]: any[] };
}

const RecursiveTable = ({
  th,
  tr = { "No Data": [] },
}: RecursiveTableProps) => {
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

export default RecursiveTable;
