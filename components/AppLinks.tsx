import Link from "next/link";
import { useRouter } from "next/router";

export default function AppLinks() {
  const router = useRouter();

  return (
    <div className="mb-4 border-b border-slate-600">
      <ul
        className="flex flex-wrap text-center text-sm font-medium"
        role="tablist"
      >
        <li className="mr-2 last:mr-0" role="presentation">
          <Link
            href="/dashboard"
            aria-selected={router.pathname === "/dashboard"}
            className="inline-block rounded-t-lg px-4 py-2 font-bold drop-shadow-lg hover:text-sky-500 aria-selected:bg-slate-600 aria-selected:text-white"
          >
            儀表板
          </Link>
        </li>
        <li className="mr-2 last:mr-0" role="presentation">
          <Link
            href="/assign"
            aria-selected={router.pathname === "/assign"}
            className="inline-block rounded-t-lg px-4 py-2 font-bold drop-shadow-lg hover:text-sky-500 aria-selected:bg-slate-600 aria-selected:text-white"
          >
            側錄服務
          </Link>
        </li>
      </ul>
    </div>
  );
}
