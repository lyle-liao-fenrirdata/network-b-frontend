export const TableContainer = ({
  containers,
}: {
  containers: {
    key: string;
    name: string;
    state: string;
    status: string;
    created: string;
    action: JSX.Element;
  }[];
}) => (
  <table className="w-full border-collapse items-center bg-transparent">
    <thead>
      <tr>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          Container Name
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          State
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          Status
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          Created At
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-center align-middle text-xs font-semibold text-slate-500">
          停用容器
        </th>
      </tr>
    </thead>
    <tbody>
      {containers.map((c) => (
        <tr key={c.key} className="hover:bg-slate-100 ">
          <th className="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
            <span className="ml-3 font-bold text-slate-600">{c.name}</span>
          </th>
          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
            {c.state}
          </td>
          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
            {c.status}
          </td>
          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
            {c.created}
          </td>
          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
            {c.action}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
