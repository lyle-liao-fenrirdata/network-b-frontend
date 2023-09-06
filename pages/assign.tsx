import AppLinks from "@/components/AppLinks";
import AppNavbar from "@/components/AppNavbar";
import Container from "@/components/Container";
import SignalInfo from "@/components/SignalInfo";
import ModalExtAssign from "@/components/app/ModalExtAssign";
import { RestfullAPI } from "@/fakeData/C_PageData";
import { ChangeEvent, useEffect, useState } from "react";

interface FormInputs extends Omit<RestfullAPI, "RecordID"> {
  SatelliteID: string;
  Polarization: string;
  Frequency: string;
}

export default function Assign() {
  const [inputs, setInputs] = useState<FormInputs>({
    SatelliteID: "",
    Polarization: "",
    Frequency: "",
    ServerType: "",
    Timestamp: "",
    Capture: "Enable",
    ModemDataIP: "",
    ModemDataDestPort: "",
    ModemModel: "",
  });
  const [sendStatus, setSendStatus] = useState<boolean | "loading">(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  function sendDataTransform(data: FormInputs) {
    return {
      RecordID: `${data.SatelliteID}${data.Polarization}${data.Frequency}`,
      ServerType: data.ServerType,
      Timestamp: Math.round(Date.now() / 1000).toString(),
      Capture: data.Capture,
      ModemDataIP: data.ModemDataIP,
      ModemDataDestPort: data.ModemDataDestPort,
      ModemModel: data.ModemModel,
    };
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const key = e.target.name;
    let value = e.target.value;
    if (key === "SatelliteID") value = value.toUpperCase().slice(0, 2);
    else if (key === "Polarization") value = value.toUpperCase().slice(0, 1);
    else if (key === "Frequency" || key === "ModemDataDestPort") {
      if (!value.match(/^[\d]*$/g)) return;
      value = value.toUpperCase().slice(0, 11);
    } else if (key === "ModemDataIP") {
      if (!value.match(/^[\d\.]*$/g)) return;
      value = value.toUpperCase().slice(0, 16);
    }
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  async function postBackend() {
    setSendStatus(() => "loading");
    const responses = await fetch("/api/CaptureCommand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendDataTransform(inputs)),
    });

    if (responses.ok) {
      setSendStatus(() => true);
    } else {
      const error = await responses.text();
      console.error(error);
      setSendStatus(() => false);
    }
  }

  return (
    <div className="relative min-h-screen min-w-full bg-slate-100">
      <AppNavbar />
      <main className="relative w-full px-4 py-8 lg:px-10">
        <AppLinks />
        <Container>
          <div className="mb-4 grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4">
            {/* Left Part */}
            <div className="flex flex-col items-start gap-2">
              {/* Record ID */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[96px] whitespace-nowrap">
                  Record ID
                </span>
                <input
                  type="text"
                  disabled
                  value={`${inputs.SatelliteID}${inputs.Polarization}${inputs.Frequency}`}
                  className="relative w-full rounded border-transparent bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
              </div>
              {/* Satellite ID */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[96px] whitespace-nowrap pl-4">
                  Satellite ID
                </span>
                <input
                  type="text"
                  name="SatelliteID"
                  value={inputs.SatelliteID}
                  onChange={onChange}
                  className="relative w-[128px] shrink-0 rounded bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
                <span className="grow-1 whitespace-pre-line italic opacity-80">
                  衛星名簡寫兩碼，如AA、DH。
                </span>
              </div>
              {/* Polarization */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[96px] whitespace-nowrap pl-4">
                  Polarization
                </span>
                <input
                  type="text"
                  name="Polarization"
                  value={inputs.Polarization}
                  onChange={onChange}
                  className="relative w-[128px] shrink-0 rounded bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
                <span className="grow-1 whitespace-pre-line italic opacity-80">
                  極化一碼，如V、H。
                </span>
              </div>
              {/* Frequency */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[96px] whitespace-nowrap pl-4">
                  Frequency
                </span>
                <input
                  type="number"
                  name="Frequency"
                  value={inputs.Frequency}
                  onChange={onChange}
                  className="relative w-[128px] shrink-0 rounded bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
                <span className="grow whitespace-pre-line italic opacity-80">
                  中心頻率Hz，11位數，如 11669000000。
                </span>
              </div>
              {/* Server Type */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[96px] whitespace-nowrap">
                  Server Type
                </span>
                <select
                  name="ServerType"
                  value={inputs.ServerType}
                  onChange={onChange}
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                >
                  <option value="">請選擇</option>
                  <option value="IP">IP</option>
                  <option value="DVB">DVB</option>
                  <option value="HDLC">HDLC</option>
                </select>
              </div>
            </div>
            {/* Right Part */}
            <div className="flex flex-col items-start gap-2">
              {/* Timestamp (Unix Time) */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[168px] whitespace-nowrap">
                  Timestamp (Unix Time)
                </span>
                <input
                  type="text"
                  disabled
                  value="資料送出時，自動產生"
                  className="relative w-full rounded border-transparent bg-white px-3 py-2 text-center text-sm text-slate-600 outline-none"
                />
              </div>
              {/* Capture */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[168px] whitespace-nowrap">Capture</span>
                <input
                  type="text"
                  name="Capture"
                  disabled
                  value={inputs.Capture}
                  className="relative w-full rounded border-transparent bg-white px-3 py-2 text-center text-sm text-slate-600 outline-none"
                />
              </div>
              {/* Modem Data IP */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[168px] whitespace-nowrap">
                  Modem Data IP
                </span>
                <input
                  type="text"
                  name="ModemDataIP"
                  value={inputs.ModemDataIP}
                  onChange={onChange}
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
              </div>
              {/* Modem Data Dest Port */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[168px] whitespace-nowrap">
                  Modem Data Dest Port
                </span>
                <input
                  type="number"
                  name="ModemDataDestPort"
                  value={inputs.ModemDataDestPort}
                  onChange={onChange}
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
              </div>
              {/* Modem Model */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[168px] whitespace-nowrap">
                  Modem Model
                </span>
                <input
                  type="text"
                  name="ModemModel"
                  value={inputs.ModemModel}
                  onChange={onChange}
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
              </div>
              {/* action section */}
              <div className="ml-auto mt-auto flex flex-row flex-nowrap items-center justify-start gap-2">
                <div className="flex w-full flex-row flex-wrap items-center justify-end gap-2">
                  <div className="relative rounded border-0 bg-amber-200 px-3 py-2 text-black">
                    <span className="inline-block">
                      <b className="capitalize">注意!</b>{" "}
                      僅以下IP開頭的，打包功能才可接收
                    </span>
                    {["192.168.16.31"].map((ip) => (
                      <span
                        key={ip}
                        className="pl-4 pr-4 text-red-700 last:pr-0"
                      >
                        {ip}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  className="shrink-0 rounded border border-solid border-slate-500 bg-transparent px-4 py-2 font-bold text-slate-500 outline-none transition-all hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSendModalOpen(true);
                    postBackend();
                  }}
                >
                  送出
                </button>
              </div>
            </div>
          </div>
        </Container>
        <Container>
          <SignalInfo />
        </Container>
      </main>

      {isSendModalOpen && (
        <ModalExtAssign
          onCloseModal={() => setIsSendModalOpen(false)}
          status={sendStatus}
          dataSent={sendDataTransform(inputs)}
        />
      )}
    </div>
  );
}
