import { ReactElement } from "react";

interface ContainerProps {
  children: ReactElement;
}

const Container = ({ children }: ContainerProps) => (
  <div className="relative mb-6 h-[calc(100%-1.5rem)] w-full overflow-x-auto break-words rounded bg-white shadow-lg">
    <div className="max-h-screen w-full overflow-y-auto p-4">{children}</div>
  </div>
);

export default Container;
