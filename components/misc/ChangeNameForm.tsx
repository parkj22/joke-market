import { useSession } from "next-auth/react";
import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import Spinner from "./Spinner";

type ChangeNameFormProps = {
  setOpenChangeNameForm: Dispatch<SetStateAction<boolean>>;
};

function ResetValueForm({
  setOpenChangeNameForm,
}: ChangeNameFormProps): ReactElement | null {
  const [formState, setFormState] = useState<string>("inputting");
  const [newName, setNewName] = useState<string>("");
  const { data: session } = useSession();

  const handleChangeName = async (): Promise<void> => {
    setFormState("resetting");
    // TODO: Add change name feature
    setFormState("incomplete");
  };

  return (
    <div className="bg-white flex flex-col w-5/6 md:w-2/3 h-[20rem] md:h-[24rem] max-w-2xl p-4 items-center justify-center shadow-md border border-gray-300 space-y-4">
      {formState == "inputting" && (
        <>
          <span className="font-bold text-xl md:text-2xl text-center">
            Enter your new name for the account:
          </span>
          <p className="text-red-600">
            Renaming may take a few minutes to complete.
          </p>
          <div className="grid grid-cols-5 border">
            <span className="font-light text-sm md:text-lg border px-2 py-4 bg-gray-100 col-span-2">
              Current name:
            </span>
            <span className="flex items-center border p-4 space-x-2 col-span-3">
              {session?.user.name}
            </span>
            <span className="font-light text-sm md:text-lg border px-2 py-4 bg-gray-100 col-span-2">
              New name:
            </span>
            <div className="flex items-center border px-4 space-x-2 col-span-3">
              <input
                type="text"
                placeholder="John Doe"
                className="font-semibold focus:outline-none md:text-lg w-full"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="flex justify-center items-center w-full pt-4">
            <div className="flex space-x-2">
              <button
                className="w-full p-4 font-light md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
                onClick={() => {
                  setFormState("inputting");
                  setOpenChangeNameForm(false);
                }}
              >
                Cancel
              </button>
              <button
                className="w-full p-4 font-light md:text-xl text-green-800 bg-green-100 hover:bg-green-200 active:bg-green-300 hover-effect border"
                onClick={handleChangeName}
              >
                Change
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
      {formState == "incomplete" && (
        <>
          <span className="text-5xl md:text-7xl">🚧</span>
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            Changing name is disabled temporarily. Sorry for the inconvenience.
          </span>
          <button
            className="p-4 font-medium md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
            onClick={() => {
              setFormState("inputting");
              setOpenChangeNameForm(false);
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
