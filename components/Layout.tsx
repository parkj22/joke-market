import { ReactElement, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./header/Header";

type LayoutProps = {
  children: ReactNode,
}

export const Layout = ({ children }: LayoutProps): ReactElement | null => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">{children}</div>
      {/* <Footer /> */}
    </>
  );
}

export default Layout;