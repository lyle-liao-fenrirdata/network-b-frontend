import AppLinks from "@/components/AppLinks";
import AppNavbar from "@/components/AppNavbar";
import Container from "@/components/Container";
import ModalCreateHost from "@/components/app/ModalCreateHost";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

export type Hosts = Prisma.Result<
  typeof prisma.host,
  Prisma.Args<Prisma.hostFindFirstArgs, "findMany">,
  "findMany"
>;

type Handler = (id: number) => Promise<void>;

type TableHostProps = {
  hosts: Hosts;
  handleStart: Handler;
  handleStop: Handler;
  handleDelete: Handler;
};

const formatDateTime = new Intl.DateTimeFormat("zh-TW", {
  hour12: false,
  dateStyle: "long",
  timeStyle: "medium",
});

const TableHost = ({
  hosts,
  handleStart,
  handleStop,
  handleDelete,
}: TableHostProps) => (
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
            {c.deletedAt ? (
              <>
                <button
                  onClick={() => handleStart(c.id)}
                  className="rounded bg-transparent px-3 py-1 font-bold text-emerald-500 outline-none transition-all hover:bg-emerald-500 hover:text-white focus:outline-none active:bg-emerald-600"
                >
                  啟用
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="rounded bg-transparent px-3 py-1 font-bold text-red-500 outline-none transition-all hover:bg-red-500 hover:text-white focus:outline-none active:bg-red-600"
                >
                  刪除
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleStop(c.id)}
                  className="rounded bg-transparent px-3 py-1 font-bold text-red-500 outline-none transition-all hover:bg-red-500 hover:text-white focus:outline-none active:bg-red-600"
                >
                  停用
                </button>
                <span className="cursor-default select-none bg-transparent px-3 py-1 font-bold text-transparent outline-none">
                  停用
                </span>
              </>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const getServerSideProps: GetServerSideProps<{
  hosts: Hosts;
  deleted: Hosts;
}> = async () => {
  const [hosts, deleted] = await Promise.all([
    await prisma.host.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" },
    }),
    await prisma.host.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return {
    props: { hosts, deleted },
  };
};

export type HostInput = Pick<
  Prisma.hostCreateInput,
  "hostName" | "comment" | "ipAddress" | "xApiKey"
>;

export default function Assign({
  hosts,
  deleted,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  async function handleStart(id: number) {
    await fetch("/api/hostRegister", {
      method: "PATCH",
      body: JSON.stringify({ id }),
    });
    router.reload();
  }
  async function handleStop(id: number) {
    await fetch("/api/hostRegister", {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
    router.reload();
  }
  async function handleDelete(id: number) {
    await fetch("/api/hostRegister", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    router.reload();
  }

  return (
    <div className="relative min-h-screen min-w-full bg-slate-100">
      <AppNavbar />
      <main className="relative w-full px-4 py-8 lg:px-10">
        <AppLinks />
        <Container>
          <>
            <div className="flex w-full flex-row justify-between pb-2">
              <h2 className="pl-2 text-xl font-bold">主機列表</h2>
              <button
                onClick={() => setIsSendModalOpen(true)}
                className="rounded border border-solid border-slate-700 bg-slate-700 px-3 py-1 font-bold text-white outline-none transition-all hover:bg-transparent hover:text-slate-700 focus:outline-none active:bg-slate-600"
              >
                新增
              </button>
            </div>
            <TableHost
              hosts={hosts}
              handleStart={handleStart}
              handleStop={handleStop}
              handleDelete={handleDelete}
            />
          </>
        </Container>
        <Container>
          <TableHost
            hosts={deleted}
            handleStart={handleStart}
            handleStop={handleStop}
            handleDelete={handleDelete}
          />
        </Container>
      </main>

      {isSendModalOpen && (
        <ModalCreateHost
          onCloseModal={() => setIsSendModalOpen(false)}
          currentIps={[
            ...hosts.map((h) => h.ipAddress),
            ...deleted.map((h) => h.ipAddress),
          ]}
        />
      )}
    </div>
  );
}
