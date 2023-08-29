import { ReactElement } from "react";

interface ChartContainerProps {
  title: JSX.Element;
  children: ReactElement;
}

const ChartContainer = ({ title, children }: ChartContainerProps) => (
  <div className="relative mb-6 h-[calc(100%-1.5rem)] w-full break-words rounded bg-white shadow-lg">
    <div className="w-full overflow-x-auto p-4">
      <span className="text-md min-w-48 absolute -left-2 -top-4 inline-block rounded bg-slate-600 px-2 py-1 font-semibold text-white drop-shadow-lg">
        {title}
      </span>
      {children}
    </div>
  </div>
);

export default ChartContainer;
