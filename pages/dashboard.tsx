import Container from "@/components/Container";
import { useEffect, useState } from "react";
import { PortainerContainer } from "./api/portainer";
import { TableContainer } from "@/components/TableContainer";
import { GetCaptureStatusBody } from "./api/GetCaptureStatus";
import AppNavbar from "@/components/AppNavbar";
import AppLinks from "@/components/AppLinks";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [containers, setContainers] = useState<PortainerContainer[]>([]);
  const [captureStatus, setCaptureStatus] = useState<
    GetCaptureStatusBody | undefined
  >(undefined);

  useEffect(() => {
    async function getPortainerContainers() {
      return await fetch("/api/portainer")
        .then((res) => res.json())
        .then(setContainers)
        .catch((err) => console.error(err));
    }
    getPortainerContainers();
    const interval = setInterval(() => {
      getPortainerContainers();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function getCaptureStatus() {
      return await fetch("/api/GetCaptureStatus", {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then(setCaptureStatus)
        .catch((err) => console.error(err));
    }
    getCaptureStatus();
    const interval = setInterval(() => {
      getCaptureStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  async function postBackend(containerName: string) {
    if (isLoading || !containerName.match(/^[A-Z]{3}[\d]{11}_[\d]{10}\./gm))
      return;
    setIsLoading(() => true);

    const RecordID = containerName.slice(0, 14);
    const Timestamp = containerName.slice(15, 25);
    const responses = await fetch("/api/CaptureCommand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        RecordID,
        Timestamp,
        Capture: "Disable",
      }),
    });

    if (!responses.ok) {
      const error = await responses.text();
      console.error(error);
      window.alert(error);
    }
    window.alert(`已成功停用 ${containerName} 的請求\n更新較慢，請等待2-3分鐘`);
    setIsLoading(() => false);
  }

  return (
    <div className="relative min-h-screen min-w-full bg-slate-100">
      <AppNavbar />
      <main className="relative w-full px-4 py-8 lg:px-10">
        <AppLinks />
        <Container>
          <TableContainer
            containers={containers.map((c) => {
              const name = (c.Names[0] ?? "").replaceAll(/[\/]/g, "");
              return {
                key: c.Id,
                name,
                state: c.State ?? "Unknown",
                status: c.Status ?? "Unknown",
                created: c.Created
                  ? new Date(c.Created * 1000).toLocaleString()
                  : "Unknown",
                action: (
                  <button
                    key="closeModal-confirm"
                    className="w-full rounded bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all hover:bg-red-500 hover:text-white focus:outline-none active:bg-red-600"
                    type="button"
                    onClick={() => postBackend(name)}
                  >
                    停止
                  </button>
                ),
              };
            })}
          />
        </Container>
        <Container>
          <>
            <div className="flex flex-row justify-between gap-4 pb-3">
              <p className="font-bold">擷取資料夾狀況</p>
              <p className="text-sm">
                最後更新時間:{" "}
                {!captureStatus?.updatedAt
                  ? "無更新"
                  : new Intl.DateTimeFormat("zh-TW", {
                      hour12: false,
                      dateStyle: "long",
                      timeStyle: "medium",
                    }).format(captureStatus.updatedAt)}
              </p>
            </div>
            <textarea
              rows={25}
              disabled
              readOnly
              value={captureStatus?.Dump}
              className="block w-full whitespace-pre-line rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              placeholder="無資料"
            />
          </>
        </Container>
      </main>
    </div>
  );
}
