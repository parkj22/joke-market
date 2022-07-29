import React, { ReactElement, useState } from "react";
import { SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router"

function SearchBar(): ReactElement | null {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    router.push(`/search/${query}`);
  };

  return (
    <form
      className="relative text-gray-600 focus-within:text-gray-400 w-full"
      onSubmit={handleSubmit}
    >
      <div>
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <button
            type="submit"
            className="p-1 focus:outline-none focus:shadow-outline"
          >
            <SearchIcon className="h-6 text-gray-400" />
          </button>
        </span>
        <input
          type="search"
          className="py-2 text-gray-600 bg-gray-100 rounded-md pl-10 pr-2 border border-gray-100 focus:outline focus:outline-gray-600 focus:bg-white focus:text-gray-900"
          placeholder="Search..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
      </div>
    </form>
  );
}

export default SearchBar;
