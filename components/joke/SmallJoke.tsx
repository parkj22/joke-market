import { CurrencyDollarIcon, ArrowUpIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import Image from "next/image";
import { ReactElement } from "react";

type SmallJokeProps = {
  id: string,
  title: string,
  mainText: string | null,
  image: string | null,
  approveCount: number,
  value: number,
}

function SmallJoke({ id, title, mainText, image, approveCount, value }: SmallJokeProps): ReactElement | null {
  const router = useRouter();

  const routeToJokePage = (): void => {
      router.push(`/jokes/${id}`);
  };

  return (
    <div
      className="relative bg-white aspect-[2/3] shadow-md border border-gray-300 hover:opacity-45 flex flex-col justify-center items-center cursor-pointer hover-effect space-y-2 p-2 overflow-hidden"
      onClick={routeToJokePage}
    >
      <div className="absolute bg-gray-600/80 active:bg-gray-700/80 opacity-0 hover:opacity-100 h-full w-full top-0 left-0 hover-effect flex justify-center items-center space-x-2 z-10">
        <ArrowUpIcon className="text-white h-6 md:h-7" />
        <span className="text-white text-lg md:text-2xl pr-2">
          {approveCount}
        </span>
        <CurrencyDollarIcon className="text-white h-6 md:h-7" />
        <span className="text-white text-lg md:text-2xl">
          {value}
        </span>
      </div>
      <div className="font-semibold text-lg text-center">
        {title.length > 30 ? title.substring(0, 30) + "..." : title}
      </div>
      {mainText && (
        <div className="font-light text-sm text-center">
          {mainText.length > 60
            ? mainText.substring(0, 60).trim() + "..."
            : mainText}
        </div>
      )}
      {image && (
        <div className="relative overflow-hidden h-1/2 w-full z-0">
          <Image src={image} objectFit="cover" layout="fill"/>
        </div>
      )}
    </div>
  );
}

export default SmallJoke;
