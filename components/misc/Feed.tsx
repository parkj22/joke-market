import { ReactElement, useState } from "react";
import Jokes from "../joke/Jokes";
import SortBar from "../joke/SortBar";

function Feed(): ReactElement | null {
  const [sortJokeBy, setSortJokeBy] = useState<string>("trending");

  return (
    <div className="flex-grow h-screen pt-4 md:pt-6 overflow-y-auto scrollbar-hide">
      <div className="">
        <div className="mx-auto max-w-md md:max-w-lg">
          <SortBar sortJokeBy={sortJokeBy} setSortJokeBy={setSortJokeBy} />
          <Jokes sortJokeBy={sortJokeBy} />
        </div>
      </div>
    </div>
  );
}

export default Feed;
