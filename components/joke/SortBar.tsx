import { ChartBarIcon, FireIcon, UsersIcon } from "@heroicons/react/solid";
import { Dispatch, ReactElement, SetStateAction, useState } from "react";

type SortBarProps = {
  sortJokeBy: string;
  setSortJokeBy: Dispatch<SetStateAction<string>>;
};

function SortBar({
  sortJokeBy,
  setSortJokeBy,
}: SortBarProps): ReactElement | null {

  return (
    <div className="flex items-center bg-white shadow-md border border-gray-300 mb-4 p-2 px-4 space-x-2">
      <button
        className={`flex items-center p-2 rounded-full space-x-1 ${
          sortJokeBy == "trending" && "bg-slate-100"
        }`}
        onClick={() => {
          setSortJokeBy("trending");
        }}
      >
        <FireIcon
          className={`h-6 w-6 ${sortJokeBy == "trending" && "text-red-600"}`}
        />
        <span
          className={`font-semibold text-xs md:text-sm ${
            sortJokeBy == "trending" && "text-red-600"
          }`}
        >
          trending
        </span>
      </button>
      <button
        className={`flex items-center p-2 rounded-full space-x-1 ${
          sortJokeBy == "following" && "bg-slate-100"
        }`}
        onClick={() => {
          setSortJokeBy("following");
        }}
      >
        <UsersIcon
          className={`h-6 w-6 ${sortJokeBy == "following" && "text-green-600"}`}
        />
        <span
          className={`font-semibold text-xs md:text-sm ${
            sortJokeBy == "following" && "text-green-600"
          }`}
        >
          following
        </span>
      </button>
      <button
        className={`flex items-center p-2 rounded-full space-x-1 ${
          sortJokeBy == "top" && "bg-slate-100"
        }`}
        onClick={() => {
          setSortJokeBy("top");
        }}
      >
        <ChartBarIcon
          className={`h-6 w-6 ${sortJokeBy == "top" && "text-blue-600"}`}
        />
        <span
          className={`font-semibold text-xs md:text-sm ${
            sortJokeBy == "top" && "text-blue-600"
          }`}
        >
          top
        </span>
      </button>
    </div>
  );
}

export default SortBar;
