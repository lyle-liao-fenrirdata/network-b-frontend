import AppLinks from "@/components/AppLinks";
import AppNavbar from "@/components/AppNavbar";
import Container from "@/components/Container";
import Modal from "@/components/Modal";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

const formatDateTime = new Intl.DateTimeFormat("zh-TW", {
  hour12: false,
  dateStyle: "long",
  timeStyle: "medium",
});

export const getServerSideProps: GetServerSideProps<{
  hosts: Prisma.Result<
    typeof prisma.host,
    Prisma.Args<Prisma.hostFindFirstArgs, "findMany">,
    "findMany"
  >;
}> = async () => {
  const hosts = await prisma.host.findMany();

  return {
    props: { hosts },
  };
};

type HostInput = Pick<
  Prisma.hostCreateInput,
  "hostName" | "comment" | "ipAddress"
>;

export default function Assign({
  hosts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [inputs, setInputs] = useState<HostInput>({
    hostName: "",
    ipAddress: "",
    comment: "",
  });

  function sendDataTransform(data: HostInput):
    | {
        ok: true;
        data: HostInput;
      }
    | {
        ok: false;
        data?: HostInput;
      } {
    const { ipAddress, hostName, comment } = data;
    const error: Partial<HostInput> = {};

    if (!comment) error.comment = "不可空白";
    if (!ipAddress) error.ipAddress = "不可空白";
    if (!hostName) error.hostName = "不可空白";
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
      data: { ipAddress, hostName, comment },
    };
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const key = e.target.name as keyof HostInput;
    let value = e.target.value;
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  async function postBackend() {
    const { ok, data } = sendDataTransform(inputs);
    if (!ok) return;
    const responses = await fetch("/api/CaptureCommand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (responses.ok) {
      router.reload();
    } else {
      const error = await responses.text();
      window.alert(error);
    }
  }

  function handleDeleteOrStop(id: number) {
    console.log("deleted");
  }

  // useEffect(() => {
  //   fetch("/SatelliteModel.json")
  //     .then(async (res) => (await res.json()) as Satelite[])
  //     .then(setSatellites)
  //     .catch((err) => {
  //       console.error(String(err));
  //     });
  // }, []);

  return (
    <div className="relative min-h-screen min-w-full bg-slate-100">
      <AppNavbar />
      <main className="relative w-full px-4 py-8 lg:px-10">
        <AppLinks />
        <Container>
          <table className="w-full border-collapse items-center bg-transparent">
            <thead>
              <tr>
                <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                  主機名稱
                </th>
                <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                  主機位址
                </th>
                <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                  附註說明
                </th>
                <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                  建立時間
                </th>
                <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                  最後變更
                </th>
                <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                  停用/移除
                </th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-100 ">
                  <th className="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                    {c.hostName}
                  </th>
                  <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                    {c.ipAddress}
                  </td>
                  <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                    {c.comment}
                  </td>
                  <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                    {formatDateTime.format(Number(c.createdAt))}
                  </td>
                  <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                    {formatDateTime.format(Number(c.updatedAt))}
                  </td>
                  <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                    <button
                      onClick={() => handleDeleteOrStop(c.id)}
                      className="rounded bg-transparent px-3 py-1 font-bold text-red-500 outline-none transition-all hover:bg-red-500 hover:text-white focus:outline-none active:bg-red-600"
                    >
                      {c.deletedAt ? "刪除" : "停用"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
        <Container>
          <div className="mb-4 grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4">
            {/* <div className="flex flex-col items-start gap-2">
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <label
                  htmlFor="hostName"
                  className="min-w-[96px] whitespace-nowrap"
                >
                  主機名稱
                </label>
                <input
                  id="hostName"
                  name="hostName"
                  type="text"
                  value={inputs.hostName}
                  onChange={onChange}
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                />
              </div>
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <label
                  htmlFor="ipAddress"
                  className="min-w-[96px] whitespace-nowrap"
                >
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
                <label
                  htmlFor="comment"
                  className="min-w-[96px] whitespace-nowrap"
                >
                  附註說明
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={5}
                  onChange={onChange}
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                >
                  {inputs.comment}
                </textarea>
              </div>
              <button
                className="ml-auto rounded border border-solid border-slate-500 bg-transparent px-4 py-2 font-bold text-slate-500 outline-none transition-all hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSendModalOpen(true);
                  postBackend();
                }}
              >
                送出
              </button>
            </div> */}
            {/* Right Part */}
            <div className=" px-2"></div>
          </div>
        </Container>
        <Container>
          <></>
        </Container>
      </main>

      {isSendModalOpen && (
        <Modal
          header="確認送出"
          actions={[]}
          onCloseModal={() => setIsSendModalOpen(false)}
        >
          <>Hello</>
        </Modal>
      )}
    </div>
  );
}
