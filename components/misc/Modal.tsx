import { ReactElement, ReactNode } from "react";

type ModalProps = {
  children: ReactNode,
}

function Modal({ children }: ModalProps): ReactElement | null {
  return (
    <div className="fixed h-screen w-screen z-10 bg-gray-500/50 flex justify-center items-center" >{children}</div>
  )
}

export default Modal;