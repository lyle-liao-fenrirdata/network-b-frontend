export default function AppNavbar() {
  return (
    <nav className="relative flex h-16 w-full flex-row flex-nowrap items-center justify-start bg-slate-800 py-4">
      <div className="mx-auto flex w-full flex-wrap items-center justify-between px-4 lg:flex-nowrap lg:px-10">
        <a href="/" className="text-lg font-semibold text-white">
          訊號側錄服務
        </a>
      </div>
    </nav>
  );
}
