import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";

type LargeSearchBarProps = {
  currentQuery: string,
}

function LargeSearchBar({ currentQuery }: LargeSearchBarProps): ReactElement | null {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    // Remove forbidden characters
    let filteredQuery = query.replaceAll("/", "");
    filteredQuery = filteredQuery.replaceAll("\\", "");

    router.push(`/search/${filteredQuery}`);
  };

  useEffect(() => {
    if (currentQuery) {
      setQuery(currentQuery);
    }
  }, [currentQuery]);

  return (
    <div className="flex items-center">
      <form className="relative w-full flex" onSubmit={handleSubmit}>
        <input
          className="w-full text-xl md:text-2xl font-semibold p-4 md:p-6 border border-gray-400 focus:outline-none focus:border-gray-600 focus:text-gray-900"
          placeholder="🔍 search the market."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
        <button
          type="submit"
          className="absolute right-0 m-[1px] p-4 md:p-6 px-5 md:px-7 border-l border-gray-200 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect"
        >
          <span className="text-xl md:text-2xl font-semibold text-center text-gray-900">
            jm.
          </span>
        </button>
      </form>
    </div>
  );
}

export default LargeSearchBar;
