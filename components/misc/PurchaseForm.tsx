import { CurrencyDollarIcon } from "@heroicons/react/solid";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { db } from "../../firebase";
import Spinner from "./Spinner";

type PurchaseFormProps = {
  setOpenPurchaseForm: Dispatch<SetStateAction<boolean>>;
  jokeId: string;
  jokeTitle: string;
  jokeValue: number;
  jokeOwnerId: string | undefined;
  jokeOwnerName: string | undefined;
};

function PurchaseForm({
  setOpenPurchaseForm,
  jokeId,
  jokeTitle,
  jokeValue,
  jokeOwnerId,
  jokeOwnerName,
}: PurchaseFormProps): ReactElement | null {
  const [formState, setFormState] = useState<string>("in_review");
  const { data: session } = useSession();
  const router = useRouter();

  const handleTransaction = async (): Promise<void> => {
    setFormState("in_transaction");
    if (session && jokeOwnerId) {
      const userDocRef = doc(db, "users", session.user.id);
      const userDocSnap = await getDoc(userDocRef);
      const ownerDocRef = doc(db, "users", jokeOwnerId);
      const ownerDocSnap = await getDoc(ownerDocRef);
      const jokeDocRef = doc(db, "jokes", jokeId);
      const jokeDocSnap = await getDoc(jokeDocRef);

      if (
        userDocSnap.exists() &&
        ownerDocSnap.exists() &&
        jokeDocSnap.exists()
      ) {
        const currentCoins = userDocSnap.data().coins;

        // First, check if user has enough coins to make the purchase
        if (currentCoins < jokeValue) {
          setFormState("insufficient_funds");
          return;
        }
        // Second, check if user already owns the joke
        if (jokeDocSnap.data().owner == session.user.id) {
            setFormState("transaction_incomplete");
            return;
        }

        // Update users' coins and joke's owner prop
        await updateDoc(userDocRef, {
          coins: currentCoins - jokeValue,
          jokes: arrayUnion(jokeId),
        });
        await updateDoc(ownerDocRef, {
          coins: ownerDocSnap.data().coins + jokeValue,
          jokes: arrayRemove(jokeId),
        });
        await updateDoc(jokeDocRef, { owner: session.user.id });

        setFormState("transaction_complete");
        return;
      }
    }
    setFormState("transaction_incomplete");
  };

  return (
    <div className="bg-white flex flex-col h-[28rem] w-5/6 md:w-2/3 max-w-2xl p-4 items-center justify-center shadow-md border border-gray-300 space-y-4">
      {formState == "in_review" && (
        <>
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full border-b-2">
            Please review the following details for this transaction.
          </span>
          <table className="w-full border">
            <thead>
              <tr>
                <th className="font-medium text-sm md:text-base px-4 py-2 text-left border bg-yellow-100">
                  Joke description
                </th>
                <th className="font-medium text-sm md:text-base px-4 py-2 text-left border bg-yellow-100">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-light text-sm md:text-base px-4 py-2 text-left border">
                  Joke ID
                </td>
                <td className="font-light text-sm md:text-base px-4 py-2 text-left border">
                  {jokeId}
                </td>
              </tr>
              <tr>
                <td className="font-light text-sm md:text-base px-4 py-2 text-left border">
                  Title
                </td>
                <td className="font-light text-sm md:text-base px-4 py-2 text-left border">
                  {jokeTitle.length > 20
                    ? jokeTitle.substring(0, 20) + "..."
                    : jokeTitle}
                </td>
              </tr>
              <tr>
                <td className="font-light text-sm md:text-base px-4 py-2 text-left border">
                  Current Owner
                </td>
                <td className="font-light text-sm md:text-base px-4 py-2 text-left border">
                  {jokeOwnerName}
                </td>
              </tr>
              <tr>
                <td className="font-light text-sm md:text-base px-4 py-2 text-left border">
                  Value
                </td>
                <td className="px-4 py-2 text-left flex items-center space-x-1">
                  <CurrencyDollarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold text-sm md:text-base">
                    {jokeValue}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="w-full flex justify-end pb-2 border-b-2">
            <span className="font-light text-xs md:text-base">
              <b className="text-red-500">*</b> refunds are not available after
              the transaction.
            </span>
          </div>
          <div className="flex w-full space-x-2 justify-end">
            <button
              className="p-4 px-6 font-medium md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
              onClick={() => {
                setOpenPurchaseForm(false);
              }}
            >
              Cancel
            </button>
            <button
              className="p-4 font-medium md:text-xl text-green-800 bg-green-100 hover:bg-green-200 active:bg-green-300 hover-effect border"
              onClick={handleTransaction}
            >
              Proceed
            </button>
          </div>
        </>
      )}
      {formState == "in_transaction" && (
        <>
          <Spinner />
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            Processing your purchase...
          </span>
        </>
      )}
      {formState == "transaction_complete" && (
        <>
          <span className="text-5xl md:text-7xl">✅</span>
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            Your purchase is complete!
          </span>
          <p className="font-light text-sm md:text-base text-center pb-6">
            Your joke is now added to your collection.
          </p>
          <button
            className="p-4 font-medium md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
            onClick={() => {
              setFormState("in_review");
              setOpenPurchaseForm(false);
              router.push(`/users/${session?.user.id}`)
            }}
          >
            Go to my collection
          </button>
        </>
      )}
      {formState == "transaction_incomplete" && (
        <>
          <span className="text-5xl md:text-7xl">🚧</span>
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            Your purchase could not be completed. Sorry for the inconvenience.
          </span>
          <button
            className="p-4 font-medium md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
            onClick={() => {
              setFormState("in_review");
              setOpenPurchaseForm(false);
            }}
          >
            Return to market
          </button>
        </>
      )}
      {formState == "insufficient_funds" && (
        <>
          <span className="text-5xl md:text-7xl">🚫</span>
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            You do not have enough coins to make the purchase!
          </span>
          <button
            className="p-4 font-medium md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
            onClick={() => {
              setFormState("in_review");
              setOpenPurchaseForm(false);
            }}
          >
            Return to market
          </button>
        </>
      )}
    </div>
  );
}

export default PurchaseForm;
