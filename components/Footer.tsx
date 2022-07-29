import { ReactElement } from "react";

const Footer = (): ReactElement | null => {
  return (
    <div className="bg-white h-20 flex justify-end items-center">
      <span className="mr-6 font-light text-sm text-gray-600">© 2022 joke market.</span>
    </div>
  )
}

export default Footer;