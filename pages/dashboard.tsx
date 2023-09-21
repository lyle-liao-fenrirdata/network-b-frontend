import Container from "@/components/Container";
import { useCallback, useEffect, useState } from "react";
import { GetHostContainerAndStatus } from "./api/portainer";
import { TableContainer } from "@/components/TableContainer";
import AppNavbar from "@/components/AppNavbar";
import AppLinks from "@/components/AppLinks";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [hostContainers, setHostContainers] = useState<
    GetHostContainerAndStatus[]
  >([]);

  const getPortainerContainers = useCallback(async () => {
    return await fetch("/api/portainer")
      .then((res) => res.json())
      .then(setHostContainers)
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    getPortainerContainers();
    const interval = setInterval(() => {
      getPortainerContainers();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function postBackend(ipAddress: string, containerName: string) {
    if (isLoading || !containerName.match(/^[A-Z]{3}[\d]{11}_[\d]{10}\./gm))
      return;
    setIsLoading(() => true);

    const RecordID = containerName.slice(0, 14);
    const Timestamp = containerName.slice(15, 25);
    const responses = await fetch(
      "/api/CaptureCommand?ipAddress=" + ipAddress,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          RecordID,
          Timestamp,
          Capture: "Disable",
        }),
      }
    );

    if (!responses.ok) {
      const error = await responses.text();
      console.error(error);
      window.alert(error);
      return;
    }
    getPortainerContainers();
    window.alert(`已成功停用 ${containerName} 的請求`);
    setIsLoading(() => false);
  }

  return (
    <div className="relative min-h-screen min-w-full bg-slate-100">
      <AppNavbar />
      <main className="relative w-full px-4 py-8 lg:px-10">
        <AppLinks />
        {!hostContainers.length && (
          <Container>
            <>
              <span className="block py-2 font-bold">沒有 ip 主機位址</span>
            </>
          </Container>
        )}
        {hostContainers.map(({ host, containers, captureStatus }) => (
          <Container key={`host-${host.id}`}>
            <>
              <p className="block whitespace-nowrap pb-2 pl-2">
                <span className="block pb-2 font-bold">
                  {`${host.hostName} (${host.ipAddress})`}
                </span>
                <span className="whitespace-pre-line text-xs">
                  {host.comment ?? "無註解"}
                </span>
              </p>
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
                        onClick={() => postBackend(host.ipAddress, name)}
                      >
                        停止
                      </button>
                    ),
                  };
                })}
              />
              <div className="my-2 w-full border-t border-slate-200"></div>
              <div className="flex flex-row justify-between gap-4 pb-3">
                <p className="pl-2">擷取資料夾狀況</p>
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
                rows={10}
                disabled
                readOnly
                value={captureStatus?.Dump}
                className="block w-full whitespace-pre-line rounded-lg border-none bg-gray-50 p-2.5 text-sm text-gray-900"
                placeholder="無資料"
              />
            </>
          </Container>
        ))}
      </main>
    </div>
  );
}
