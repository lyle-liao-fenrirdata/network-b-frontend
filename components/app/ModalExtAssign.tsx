import React from "react";
import ModalExt, { ModalExtProps } from "./ModalExt";

interface ModalExtAssignProps
  extends Omit<ModalExtProps, "children" | "header" | "ths" | "actions"> {
  status: boolean | "loading";
  dataSent: { [key: string]: string };
}

export default function ModalExtAssign({
  onCloseModal,
  status,
  dataSent,
}: ModalExtAssignProps) {
  return (
    <ModalExt
      header="資料傳送"
      onCloseModal={onCloseModal}
      actions={[
        <button
          key="closeModal"
          className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
          type="button"
          onClick={onCloseModal}
        >
          OK
        </button>,
      ]}
      ths={["傳送對象", "狀態", "傳送內容"]}
    >
      <tr>
        <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
          後臺系統
        </th>
        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
          {!status
            ? "❌ 失敗"
            : status === "loading"
            ? "🔜 傳送中..."
            : "✅ 成功"}
        </td>
        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
          <pre className="max-h-[30vh] overflow-y-scroll">
            {JSON.stringify(dataSent, undefined, 4)}
          </pre>
        </td>
      </tr>
    </ModalExt>
  );
}
