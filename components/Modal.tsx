import { MouseEventHandler, ReactElement } from "react";

export interface ModalProps {
  children: ReactElement;
  header: string;
  actions: JSX.Element[];
  onCloseModal: MouseEventHandler<HTMLButtonElement>;
}

export default function Modal({
  children,
  header,
  actions,
  onCloseModal,
}: ModalProps) {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden py-6 outline-none focus:outline-none">
        <div className="relative mx-auto w-auto">
          {/*content*/}
          <div className="relative rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 px-5 py-3">
              <h3 className="text-lg font-semibold">{header}</h3>
              <button
                className="float-right ml-auto border-0 bg-transparent p-1 text-xl font-semibold leading-none text-black opacity-50 outline-none focus:outline-none"
                onClick={onCloseModal}
              >
                x
              </button>
            </div>
            {/*body*/}
            <div className="relative flex-auto overflow-y-auto px-6 py-2">
              {children}
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 px-6 py-3">
              {...actions}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
}
