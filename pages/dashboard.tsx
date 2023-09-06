import Container from "@/components/Container";
import { useEffect, useState } from "react";
import { PortainerContainer } from "./api/portainer";
import { TableContainer } from "@/components/TableContainer";
import { GetCaptureStatusBody } from "./api/GetCaptureStatus";
import AppNavbar from "@/components/AppNavbar";
import AppLinks from "@/components/AppLinks";

export default function Dashboard() {
  const [containers, setContainers] = useState<PortainerContainer[]>([]);
  const [containerId, setContainerId] = useState<string>("");
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
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // console.log(containers);

  useEffect(() => {
    async function getCaptureStatus() {
      return await fetch(`/api/GetCaptureStatus?RecordID=${containerId}`)
        .then((res) => res.json())
        .then(setCaptureStatus)
        .catch((err) => console.error(err));
    }
    if (containerId) {
      getCaptureStatus();
      const interval = setInterval(() => {
        getCaptureStatus();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [containerId]);

  return (
    <div className="relative min-h-screen min-w-full bg-slate-100">
      <AppNavbar />
      <main className="relative w-full px-4 py-8 lg:px-10">
        <AppLinks />
        <Container>
          <TableContainer
            containers={containers.map((c) => ({
              key: c.Id,
              name: (c.Names[0] ?? "").replaceAll(/[\/]{0,}/g, ""),
              state: c.State ?? "Unknown",
              status: c.Status ?? "Unknown",
              created: c.Created
                ? new Date(c.Created * 1000).toLocaleString()
                : "Unknown",
              action: (
                <button
                  key="closeModal-confirm"
                  className="w-full rounded bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
                  type="button"
                  onClick={() => setContainerId(c.Id)}
                >
                  查看
                </button>
              ),
            }))}
          />
        </Container>
        <Container>
          <>{JSON.stringify(captureStatus, undefined, 4)}</>
        </Container>
      </main>
    </div>
  );
}
