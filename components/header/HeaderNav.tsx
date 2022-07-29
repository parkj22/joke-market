import { HomeIcon, PencilIcon, SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";

const NavState = {
  Home: 0,
  Edit: 1,
  Search: 2,
};

function HeaderNav(): ReactElement | null {
  const [currentState, setCurrentState] = useState<number>(NavState.Home);
  const router = useRouter();

  return (
    <div className="h-full flex items-center space-x-8 mr-8">
      <button
        className={`flex items-center h-full cursor-pointer border-b-[3px] border-black ${
          currentState != NavState.Home && "border-white"
        }`}
        onClick={() => {
          setCurrentState(NavState.Home);
          router.push("/");
        }}
      >
        <HomeIcon className="h-7" />
      </button>
      <button
        className={`flex items-center h-full cursor-pointer border-b-[3px] border-black ${
          currentState != NavState.Edit && "border-white"
        }`}
        onClick={() => {
          setCurrentState(NavState.Edit);
          router.push("/edit");
        }}
      >
        <PencilIcon className="h-7" />
      </button>
      <button
        className={`flex items-center h-full cursor-pointer border-b-[3px] border-black ${
          currentState != NavState.Search && "border-white"
        }`}
        onClick={() => {
          setCurrentState(NavState.Search);
          router.push("/search");
        }}
      >
        <SearchIcon className="h-7" />
      </button>
    </div>
  );
}

export default HeaderNav;
