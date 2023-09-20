import AppLinks from "@/components/AppLinks";
import AppNavbar from "@/components/AppNavbar";
import Container from "@/components/Container";
import SignalInfo from "@/components/SignalInfo";
import ModalExtAssign from "@/components/app/ModalExtAssign";
import { RestfullAPI } from "@/fakeData/C_PageData";
import { prisma } from "@/prisma/prisma";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import { Hosts } from "./host";
import { useRouter } from "next/router";
import Modal from "@/components/Modal";

export const getServerSideProps: GetServerSideProps<{
  hosts: Pick<Hosts[number], "ipAddress" | "hostName">[];
}> = async () => {
  const hosts = await prisma.host.findMany({
    where: { deletedAt: null },
    select: {
      ipAddress: true,
      hostName: true,
    },
    orderBy: { ipAddress: "asc" },
  });

  return {
    props: { hosts },
  };
};

interface FormInputs extends Omit<RestfullAPI, "RecordID"> {
  SatelliteID: string;
  Polarization: string;
  Frequency: string;
}

interface Satelite {
  id: number;
  code: string;
  name: string;
  longitude: string;
}

export default function Assign({
  hosts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [ipAddress, setIpAddress] = useState<string>("");
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
    Source: "networkB",
  });
  const [sendData, setSendData] = useState<RestfullAPI>();
  const [sendStatus, setSendStatus] = useState<boolean | "loading">(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [satellites, setSatellites] = useState<Satelite[]>([]);

  function sendDataTransform(data: FormInputs):
    | {
        ok: true;
        data: RestfullAPI;
      }
    | {
        ok: false;
        data?: RestfullAPI;
      } {
    const {
      SatelliteID,
      Polarization,
      Frequency,
      ServerType,
      Capture,
      ModemDataIP,
      ModemDataDestPort,
      ModemModel,
      Source,
    } = data;
    const error: { [key: string]: string } = {};

    if (!SatelliteID.match(/^[A-Z]{2}$/))
      error["Satellite ID"] = "必須為 2 個大寫英文";
    if (!Polarization.match(/^[A-Z]{1}$/))
      error.Polarization = "必須為 1 個大寫英文";
    if (!Frequency.match(/^[\d]{11}$/)) error.Frequency = "必須為 11 位數數字";
    if (!ServerType) error["Server Type"] = "請選擇型態";
    if (!ModemDataDestPort) error["Modem Data Dest Port"] = "不可空白";
    if (!ModemDataIP) error["Modem Data IP"] = "不可空白";
    if (!ModemModel) error["Modem Model"] = "不可空白";
    if (Object.keys(error).length > 0) {
      window.alert(
        Object.entries(error)
          .map(([key, value]) => `${key} ${value}`)
          .join("\n")
      );
      return {
        ok: false,
      };
    }
    return {
      ok: true,
      data: {
        RecordID: `${SatelliteID}${Polarization}${Frequency}`,
        ServerType: ServerType === "DVB" ? "IP" : ServerType,
        Timestamp: Math.round(Date.now() / 1000).toString(),
        Capture,
        ModemDataIP,
        ModemDataDestPort,
        ModemModel,
        Source,
      },
    };
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const key = e.target.name;
    let value = e.target.value;
    if (key === "SatelliteID") {
      if (!value.match(/^[A-Za-z]{1,2}$/)) return;
      value = value.toUpperCase();
    } else if (key === "Polarization") {
      if (!value.match(/^[A-Za-z]{1}$/)) return;
      value = value.toUpperCase();
    } else if (key === "Frequency" || key === "ModemDataDestPort") {
      if (!value.match(/^[\d]*$/g)) return;
      value = value.slice(0, 11);
    } else if (key === "ModemDataIP") {
      if (!value.match(/^[\d]*[\d\.]*[\d]*$/g)) return;
      value = value.toUpperCase().slice(0, 16);
    }
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  async function postBackend() {
    const { ok, data } = sendDataTransform(inputs);
    if (!ok) return;
    setSendStatus(() => "loading");
    setSendData(() => data);
    const responses = await fetch(
      "/api/CaptureCommand?ipAddress=" + ipAddress,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (responses.ok) {
      setSendStatus(() => true);
    } else {
      const error = await responses.text();
      console.error(error);
      setSendStatus(() => false);
    }
  }

  useEffect(() => {
    fetch("/SatelliteModel.json")
      .then(async (res) => (await res.json()) as Satelite[])
      .then(setSatellites)
      .catch((err) => {
        console.error(String(err));
      });
  }, []);

  const onCloseModal = () =>
    sendStatus === true ? router.reload() : setIsSendModalOpen(false);

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
                <span className="min-w-[96px] whitespace-nowrap">線路編號</span>
                <input
                  type="text"
                  disabled
                  value={`${inputs.SatelliteID}${inputs.Polarization}${inputs.Frequency}`}
                  className="relative w-full rounded border-transparent bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
              </div>
              {/* Satellite ID */}
              <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2">
                <span className="min-w-[96px] whitespace-nowrap pl-3">
                  衛星代號
                </span>
                <input
                  type="text"
                  id="SatelliteID"
                  name="SatelliteID"
                  value={inputs.SatelliteID}
                  onChange={onChange}
                  className="relative w-[128px] shrink-0 rounded bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
                <select
                  id="SatelliteIDSelect"
                  name="SatelliteID"
                  value={inputs.SatelliteID}
                  onChange={onChange}
                  className="relative ml-auto rounded bg-white px-3 py-2 text-sm text-slate-600 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                >
                  <option value="">請選擇</option>
                  {satellites.map((s) => (
                    <option key={s.id} value={s.code}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Polarization */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[96px] whitespace-nowrap pl-3">
                  極化
                </span>
                <select
                  id="Polarization"
                  name="Polarization"
                  value={inputs.Polarization}
                  onChange={onChange}
                  className="relative w-[128px] shrink-0 rounded bg-white px-3 py-2 text-sm text-slate-600 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                >
                  <option value="">請選擇</option>
                  <option value="V">V</option>
                  <option value="H">H</option>
                  <option value="L">L</option>
                  <option value="R">R</option>
                </select>
              </div>
              {/* Frequency */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[96px] whitespace-nowrap pl-3">
                  中心頻率
                </span>
                <input
                  type="text"
                  id="Frequency"
                  name="Frequency"
                  value={inputs.Frequency}
                  onChange={onChange}
                  className="relative w-[128px] shrink-0 rounded bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
              </div>
              {/* backend ip */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[96px] whitespace-nowrap">服務類型</span>
                <select
                  id="ipAddress"
                  name="ipAddress"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                >
                  {hosts.map(({ ipAddress, hostName }) => (
                    <option key={ipAddress} value={hostName}>
                      {`${hostName} - ${ipAddress}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Right Part */}
            <div className="flex flex-col items-start gap-2">
              {/* Server Type */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[96px] whitespace-nowrap">服務類型</span>
                <select
                  id="ServerType"
                  name="ServerType"
                  value={inputs.ServerType}
                  onChange={onChange}
                  className="relative w-[128px] rounded bg-white px-3 py-2 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                >
                  <option value="">請選擇</option>
                  <option value="IP">IP</option>
                  <option value="DVB">DVB</option>
                  <option value="HDLC">HDLC</option>
                </select>
              </div>
              {/* Timestamp (Unix Time) */}
              {/* <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[168px] whitespace-nowrap">
                  Timestamp (Unix Time)
                </span>
                <input
                  type="text"
                  disabled
                  value="資料送出時，自動產生"
                  className="relative w-full rounded border-transparent bg-white px-3 py-2 text-center text-sm text-slate-600 outline-none"
                />
              </div> */}
              {/* Capture */}
              {/* <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[168px] whitespace-nowrap">Capture</span>
                <input
                  type="text"
                  name="Capture"
                  disabled
                  value={inputs.Capture}
                  className="relative w-full rounded border-transparent bg-white px-3 py-2 text-center text-sm text-slate-600 outline-none"
                />
              </div> */}
              {/* Modem Data IP */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[168px] whitespace-nowrap">
                  調解器IP位址
                </span>
                <input
                  type="text"
                  id="ModemDataIP"
                  name="ModemDataIP"
                  value={inputs.ModemDataIP}
                  onChange={onChange}
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
              </div>
              {/* Modem Data Dest Port */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[168px] whitespace-nowrap">
                  調解器資料目的的埠
                </span>
                <input
                  type="text"
                  id="ModemDataDestPort"
                  name="ModemDataDestPort"
                  value={inputs.ModemDataDestPort}
                  onChange={onChange}
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
              </div>
              {/* Modem Model */}
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[168px] whitespace-nowrap">
                  調解器型號
                </span>
                <input
                  type="text"
                  id="ModemModel"
                  name="ModemModel"
                  value={inputs.ModemModel}
                  onChange={onChange}
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                />
              </div>
              {/* action section */}
              <div className="ml-auto mt-auto flex flex-row flex-nowrap items-center justify-start gap-2">
                {/* <div className="flex w-full flex-row flex-wrap items-center justify-end gap-2">
                  <div className="relative rounded border-0 bg-amber-200 px-3 py-2 text-black">
                    <span className="inline-block">
                      <b className="capitalize">注意!</b>{" "}
                      僅以下IP開頭的，打包功能才可接收
                    </span>
                    {["192.168.17.31"].map((ip) => (
                      <span
                        key={ip}
                        className="pl-4 pr-4 text-red-700 last:pr-0"
                      >
                        {ip}
                      </span>
                    ))}
                  </div>
                </div> */}
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

      {isSendModalOpen && sendData && (
        // <ModalExtAssign
        //   onCloseModal={() =>
        //     sendStatus === true ? router.reload() : setIsSendModalOpen(false)
        //   }
        //   status={sendStatus}
        //   dataSent={{ ...sendData }}
        // />
        <Modal
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
        >
          <center className="block min-w-[325px] py-8">
            {!sendStatus
              ? "❌ 失敗"
              : status === "loading"
              ? "🔜 傳送中..."
              : "✅ 成功"}
          </center>
        </Modal>
      )}
    </div>
  );
}
