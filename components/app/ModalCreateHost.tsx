import React, { ChangeEvent, useState } from "react";
import Modal, { ModalProps } from "../Modal";
import { HostInput } from "@/pages/host";
import { useRouter } from "next/router";

const ipAddressRegex = /^[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}$/g;

export interface ModalCreateHostProps extends Pick<ModalProps, "onCloseModal"> {
  currentIps: string[];
}

export default function ModalCreateHost({
  currentIps,
  onCloseModal,
}: ModalCreateHostProps) {
  const router = useRouter();
  const [inputs, setInputs] = useState<HostInput>({
    hostName: "",
    ipAddress: "",
    comment: "",
    xApiKey: "",
  });

  async function sendDataTransform(data: HostInput): Promise<
    | {
        ok: true;
        data: HostInput;
      }
    | {
        ok: false;
        data?: HostInput;
      }
  > {
    const { ipAddress, hostName, comment, xApiKey } = data;
    const error: { [key: string]: string } = {};

    if (!xApiKey) error["主機 API Key"] = "不可空白";
    if (!ipAddress) error["主機位址"] = "不可空白";
    if (!ipAddress.match(ipAddressRegex)) error["主機位址"] = "格式不符";
    if (currentIps.some((v) => v === ipAddress)) error["主機位址"] = "重複位置";
    if (!error["主機位址"] && !error["主機 API Key"]) {
      const testPortainer = await fetch(
        `/api/hostRegister?ipAddress=http://${ipAddress}&xApiKey=${xApiKey}`
      );
      if (testPortainer.status !== 200)
        error["主機 API Key"] = "請檢查 ip 或api key, 測試連線失敗!";
    }
    if (!hostName) error["主機名稱"] = "不可空白";
    if (Object.keys(error).length > 0) {
      window.alert(
        Object.entries(error)
          .map(([key, value]) => `${key} => ${value}`)
          .join("\n")
      );
      return {
        ok: false,
      };
    }
    return {
      ok: true,
      data: { ipAddress, hostName, comment, xApiKey },
    };
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const key = e.target.name as keyof HostInput;
    let value = e.target.value;
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  async function postBackend() {
    const { ok, data } = await sendDataTransform(inputs);
    if (!ok) return;
    const responses = await fetch("/api/hostRegister", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (responses.ok) {
      router.reload();
    } else {
      const error = await responses.text();
      window.alert(error);
    }
  }

  return (
    <Modal
      header="新增主機位址"
      actions={[
        <button
          key="cancel"
          className="rounded bg-transparent px-3 py-1 font-bold text-red-500 outline-none transition-all hover:bg-red-500 hover:text-white focus:outline-none active:bg-red-600"
          type="button"
          onClick={onCloseModal}
        >
          取消
        </button>,
        <button
          key="submit"
          className="ml-2 rounded border border-solid border-slate-700 bg-slate-700 px-3 py-1 font-bold text-white outline-none transition-all hover:bg-transparent hover:text-slate-700 focus:outline-none active:bg-slate-600"
          type="button"
          onClick={() => postBackend()}
        >
          送出
        </button>,
      ]}
      onCloseModal={onCloseModal}
    >
      <div className="flex min-w-[420px] flex-col items-start gap-2 py-4">
        <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
          <label htmlFor="hostName" className="min-w-[96px] whitespace-nowrap">
            主機名稱
          </label>
          <input
            autoFocus
            id="hostName"
            name="hostName"
            type="text"
            value={inputs.hostName}
            onChange={onChange}
            className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
          />
        </div>
        <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
          <label htmlFor="ipAddress" className="min-w-[96px] whitespace-nowrap">
            主機位址
          </label>
          <input
            id="ipAddress"
            name="ipAddress"
            type="text"
            value={inputs.ipAddress}
            onChange={onChange}
            className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
          />
        </div>
        <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
          <label htmlFor="xApiKey" className="min-w-[96px] whitespace-nowrap">
            主機 API Key
          </label>
          <input
            id="xApiKey"
            name="xApiKey"
            type="text"
            value={inputs.xApiKey}
            onChange={onChange}
            className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
          />
        </div>
        <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
          <label htmlFor="comment" className="min-w-[96px] whitespace-nowrap">
            附註說明
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={5}
            onChange={onChange}
            value={inputs.comment}
            className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}
