import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import SearchBar from "../search/SearchBar";
import HeaderNav from "./HeaderNav";
import unauthenticatedUser from "../../public/unauthenticated-user.png";
import { useRouter } from "next/router";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useState, useRef, useEffect, ReactElement, MouseEvent } from "react";
import Link from "next/link";

export default function Header(): ReactElement | null {
  const { data: session } = useSession();
  const router = useRouter();
  const [dropdownActive, setDropdownActive] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLInputElement>(null);

  const navToIndexPage = (): void => {
    router.push("/");
  };

  useEffect(() => {
    if (!dropdownActive) return;
    const disableDropdown = (e: Event): void => {
      const { target } = e;
      if (dropdownRef.current && !dropdownRef.current.contains(target as Node)) {
        setDropdownActive(false);
      }
    };
    window.addEventListener("mousedown", disableDropdown);
    return () => window.removeEventListener("mousedown", disableDropdown);
  }, [dropdownActive]);

  return (
    <div className="sticky top-0 z-50 bg-white flex justify-between items-center px-2 lg:px-5 shadow-md">
      <div className="ml-2 flex space-x-4 w-1/2 items-center">
        <div onClick={navToIndexPage}>
          <span className="font-bold text-xl cursor-pointer hidden md:inline-block w-32">
            joke market.
          </span>
          <span className="font-bold text-xl cursor-pointer md:hidden w-28">
            jm.
          </span>
        </div>
        {!router.route.startsWith("/search") && (
          <div className="w-full hidden md:inline-block">
            <SearchBar />
          </div>
        )}
      </div>
      <div className="h-14 mr-2 flex items-center">
        <HeaderNav />
        <div
          className="flex items-center relative border border-gray-300 shadow-sm py-2 px-2 md:px-4 md:py-2 bg-white hover:bg-gray-100 active:bg-gray-200 hover-effect cursor-pointer"
          onClick={() => {
            setDropdownActive(!dropdownActive);
          }}
          ref={dropdownRef}
        >
          <Image
            className="rounded-full"
            src={session ? session.user.image : unauthenticatedUser}
            width="30"
            height="30"
            layout="fixed"
          />
          <ChevronDownIcon
            className="ml-1 text-gray-700"
            height={20}
            width={20}
          />
          {dropdownActive && (
            <div className="absolute origin-top-right top-12 right-0 mt-2 w-56 rounded-md shadow-lg bg-white divide-y divide-gray-200">
              <div className="py-1">
                <Link href={`/users/${session?.user.id}`}>
                  <p className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200 hover-effect cursor-pointer">
                    Signed in as <b>{session ? session.user.name : "unauthenticated user"}</b>
                  </p>
                </Link>
              </div>
              <div className="py-1">
                <Link href={`/users/${session?.user.id}`}>
                  <a className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200 hover-effect cursor-pointer">
                    Your profile
                  </a>
                </Link>
                <a className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200 hover-effect cursor-pointer">
                  Settings
                </a>
              </div>
              <div className="py-1">
                <a
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200 hover-effect cursor-pointer"
                  onClick={() => {
                    signOut({
                      callbackUrl: "/login",
                    });
                  }}
                >
                  Sign out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
