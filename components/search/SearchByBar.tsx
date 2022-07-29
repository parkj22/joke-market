import { Dispatch, ReactElement, SetStateAction, useState } from "react";

type SearchByBarProps = {
  searchBy: string,
  setSearchBy: Dispatch<SetStateAction<string>>,
}

function SearchByBar({ searchBy, setSearchBy }: SearchByBarProps): ReactElement | null {

  return (
    <div className="w-full flex border-b border-gray-300 px-4 space-x-4">
      {searchBy == "all" ? (
        <span className="p-2 font-light text-base md:text-lg text-black border-b border-black">all</span>
      ) : (
        <span className="p-2 font-light text-base md:text-lg text-gray-500 hover:text-black" onClick={() => { setSearchBy("all") }}>
          all
        </span>
      )}
      {searchBy == "jokes" ? (
        <span className="p-2 font-light text-base md:text-lg text-black border-b border-black">jokes</span>
      ) : (
        <span className="p-2 font-light text-base md:text-lg text-gray-500 hover:text-black" onClick={() => { setSearchBy("jokes") }}>
          jokes
        </span>
      )}
      {searchBy == "users" ? (
        <span className="p-2 font-light text-base md:text-lg text-black border-b border-black">users</span>
      ) : (
        <span className="p-2 font-light text-base md:text-lg text-gray-500 hover:text-black" onClick={() => { setSearchBy("users") }}>
          users
        </span>
      )}
    </div>
  );
}

export default SearchByBar;
