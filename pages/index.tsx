export default function Home() {
  return (
    <section className="header max-h-860-px relative flex h-screen items-center">
      <div className="container mx-auto flex flex-wrap items-center">
        <div className="w-full px-4 md:w-8/12 lg:w-6/12 xl:w-6/12">
          <div className="pt-32 sm:pt-0">
            <h2 className="text-4xl font-semibold text-slate-600">歡迎</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              Tropical Cyclone Signal 的 Egress 訊號指定打包功能。
            </p>
            <div className="mt-12">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/dashboard"
                className="get-started mb-1 mr-1 rounded bg-slate-400 px-6 py-4 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-slate-500"
              >
                進入系統
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* eslint-disable @next/next/no-img-element */}
      <img
        className="b-auto max-h-860-px absolute right-0 top-0 -mt-48 w-10/12 sm:mt-0 sm:w-6/12"
        src="/img/pattern_nextjs.png"
        alt="..."
      />
    </section>
  );
}
