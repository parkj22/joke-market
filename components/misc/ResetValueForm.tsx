import { CurrencyDollarIcon } from "@heroicons/react/solid";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { db } from "../../firebase";
import Spinner from "./Spinner";

type ResetValueFormProps = {
  setOpenResetValueForm: Dispatch<SetStateAction<boolean>>;
  jokeId: string;
  jokeValue: number;
};

function ResetValueForm({
  setOpenResetValueForm,
  jokeId,
  jokeValue,
}: ResetValueFormProps): ReactElement | null {
  const [formState, setFormState] = useState<string>("inputting");
  const [newValue, setNewValue] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleReset = async (): Promise<void> => {
    setFormState("resetting");

    const iNewValue = Number(newValue);

    // Check if value is in the acceptable range
    if (!(Number.isInteger(iNewValue) && iNewValue >= 0)) {
      setFormState("invalid_value");
      return;
    }

    if (session && jokeId) {
      const jokeDocRef = doc(db, "jokes", jokeId);
      const jokeDocSnap = await getDoc(jokeDocRef);

      if (jokeDocSnap.exists()) {
        // Check if user owns the joke
        if (session.user.id != jokeDocSnap.data().owner) {
          setFormState("invalid_access");
          return;
        }

        await updateDoc(jokeDocRef, { value: iNewValue });
        setFormState("complete");
        return;
      }
    }
    setFormState("incomplete");
  };

  return (
    <div className="bg-white flex flex-col w-5/6 md:w-2/3 h-[20rem] md:h-[24rem] max-w-2xl p-4 items-center justify-center shadow-md border border-gray-300 space-y-4">
      {formState == "inputting" && (
        <>
          <span className="font-bold text-xl md:text-2xl text-center">
            Please enter the new value for your joke:
          </span>
          <div className="grid grid-cols-5 border">
            <span className="font-light text-sm md:text-lg border px-2 py-4 bg-gray-100 col-span-2">
              Current value:{" "}
            </span>
            <div className="flex items-center border px-2 py-4 space-x-2 col-span-3">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-400" />
              <span className="font-light md:text-lg">{jokeValue}</span>
            </div>
            <span className="font-light text-sm md:text-lg border px-2 py-4 bg-gray-100 col-span-2">
              New value:
            </span>
            <div className="flex items-center border px-2 py-4 space-x-2 col-span-3">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-400" />
              <input
                type="number"
                placeholder="50"
                className="font-semibold focus:outline-none md:text-lg w-full"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="flex justify-center items-center w-full pt-4">
            <div className="flex space-x-2">
              <button
                className="w-full p-4 font-light md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
                onClick={() => {
                  setFormState("inputting");
                  setOpenResetValueForm(false);
                }}
              >
                Cancel
              </button>
              <button className="w-full p-4 font-light md:text-xl text-yellow-800 bg-yellow-100 hover:bg-yellow-200 active:bg-yellow-300 hover-effect border" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </>
      )}
      {formState == "resetting" && (
        <>
          <Spinner />
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            Resetting value...
          </span>
        </>
      )}
      {formState == "invalid_value" && (
        <>
          <span className="text-5xl md:text-7xl">❗</span>
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            New value must be a positive integer.
          </span>
          <button
            className="p-4 font-medium md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
            onClick={() => {
              setFormState("inputting");
              setOpenResetValueForm(false);
            }}
          >
            Return to market
          </button>
        </>
      )}
      {formState == "invalid_access" && (
        <>
          <span className="text-5xl md:text-7xl">🚫</span>
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            You are not the owner of this joke!
          </span>
          <button
            className="p-4 font-medium md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
            onClick={() => {
              setFormState("inputting");
              setOpenResetValueForm(false);
            }}
          >
            Return to market
          </button>
        </>
      )}
      {formState == "complete" && (
        <>
          <span className="text-5xl md:text-7xl">✅</span>
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            Your request is complete!
          </span>
          <div className="flex items-center space-x-1">
            <span className="font-light text-sm md:text-base text-center">
              Your joke is now valued at
            </span>
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-400" />
            <span className="font-semibold text-sm md:text-base text-center">
                {newValue}
            </span>
          </div>
          <button
            className="p-4 font-medium md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
            onClick={() => {
              setFormState("inputting");
              setOpenResetValueForm(false);
              router.reload();
            }}
          >
            Return to joke
          </button>
        </>
      )}
      {formState == "incomplete" && (
        <>
          <span className="text-5xl md:text-7xl">🚧</span>
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            Your request could not be completed. Sorry for the inconvenience.
          </span>
          <button
            className="p-4 font-medium md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
            onClick={() => {
              setFormState("inputting");
              setOpenResetValueForm(false);
            }}
          >
            Return to market
          </button>
        </>
      )}
    </div>
  );
}

export default ResetValueForm;
