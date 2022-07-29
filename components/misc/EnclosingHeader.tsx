import { ComponentType, ReactElement, ReactNode, SVGProps } from "react";

type EnclosingHeaderProps = {
  children?: ReactNode,
  HeaderIcon?: ComponentType<SVGProps<SVGSVGElement>>,
  headerText: string,
}

function EnclosingHeader({ children, HeaderIcon, headerText }: EnclosingHeaderProps): ReactElement | null {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        {HeaderIcon && <HeaderIcon className="h-8 w-8 text-black" />}
        {headerText && <h1 className="text-xl text-black">{headerText}</h1>}
      </div>
      <hr></hr>
      {children}
    </div>
  );
}

export default EnclosingHeader;
