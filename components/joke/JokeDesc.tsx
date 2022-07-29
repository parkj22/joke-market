import { CurrencyDollarIcon } from "@heroicons/react/solid";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { Dispatch, ReactElement, SetStateAction } from "react";
import { UserData } from "../../types/firebase-db";
import { useSession } from "next-auth/react";

type JokeDescProps = {
  owner: UserData | null,
  value: number,
  setOpenPurchaseForm: Dispatch<SetStateAction<boolean>>,
  setOpenResetValueForm: Dispatch<SetStateAction<boolean>>,
};

function JokeDesc({
  owner,
  value,
  setOpenPurchaseForm,
  setOpenResetValueForm,
}: JokeDescProps): ReactElement | null {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center bg-white border border-gray-300 space-x-2 mb-4">
      <div className="flex justify-between px-1 items-center space-x-2 md:ml-4">
        <div className="flex items-center">
          <span className="font-light text-xs md:text-sm mr-1">Owner: </span>
          <span className="font-semibold text-xs md:text-sm">
            {owner?.name}
          </span>
        </div>
        <button className="p-1 hover:bg-slate-200 active:bg-slate-300 rounded-full hover-effect">
          <ChevronRightIcon height={15} width={15} />
        </button>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <div className="flex items-center">
          <span className="font-light text-xs md:text-sm mr-2">Value: </span>
          <CurrencyDollarIcon
            height={20}
            width={20}
            className="text-yellow-400"
          />
          <span className="font-light text-xs md:text-sm">{value}</span>
        </div>
        <button className="p-1 hover:bg-slate-200 active:bg-slate-300 rounded-full hover-effect">
          <ChevronRightIcon height={15} width={15} />
        </button>
      </div>
      <div className="w-1/4 h-full border-l border-slate-300">
        {session?.user.id == owner?.id ? (
          <button
            className="w-full p-2 font-light text-yellow-800 bg-yellow-100 hover:bg-yellow-200 active:bg-yellow-300 hover-effect"
            onClick={() => {
              setOpenResetValueForm(true);
            }}
          >
            reset value
          </button>
        ) : (
          <button
            className="w-full p-2 font-light text-green-800 bg-green-100 hover:bg-green-200 active:bg-green-300 hover-effect"
            onClick={() => {
              setOpenPurchaseForm(true);
            }}
          >
            purchase
          </button>
        )}
      </div>
    </div>
  );
}

export default JokeDesc;
