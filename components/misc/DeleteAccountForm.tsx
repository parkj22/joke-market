import { CurrencyDollarIcon } from "@heroicons/react/solid";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { db, storage } from "../../firebase";
import Spinner from "./Spinner";

type DeleteAccountFormProps = {
  setOpenDeleteAccountForm: Dispatch<SetStateAction<boolean>>;
};

function ResetValueForm({
  setOpenDeleteAccountForm,
}: DeleteAccountFormProps): ReactElement | null {
  const [formState, setFormState] = useState<string>("inputting");
  const [confirmName, setConfirmName] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleDelete = async (): Promise<void> => {
    setFormState("deleting");
    if (session) {
      const userDocRef = doc(db, "users", session.user.id);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        const jokes: string[] = data.jokes;
        const followers = data.followers;
        const followings = data.following;

        for (const joke of jokes) {
          const jokeDocRef = doc(db, "jokes", joke);
          const jokeDocSnap = await getDoc(jokeDocRef);

          const commentCollection = collection(db, "jokes", joke, "comments");
          const commentDocs = await getDocs(commentCollection);
          // Delete all comments in user's jokes
          for (const comment of commentDocs.docs) {
            await deleteDoc(comment.ref);
          }

          // Delete image if any
          if (jokeDocSnap.exists() && jokeDocSnap.data().image) {
            const imageRef = ref(storage, `jokes/${jokeDocRef.id}`);
            await deleteObject(imageRef);
          }

          // Delete all jokes
          await deleteDoc(jokeDocRef);
        }
        // Update followers
        for (const follower of followers) {
          const docRef = doc(db, "users", follower);
          await updateDoc(docRef, {
            following: arrayRemove(session.user.id),
          });
        }
        // Update following
        for (const following of followings) {
          const docRef = doc(db, "users", following);
          await updateDoc(docRef, {
            followers: arrayRemove(session.user.id),
          });
        }
      }

      const jokeQuerySnapshot = await getDocs(collection(db, "jokes"));
      // Delete comments in other users' jokes
      for (const joke of jokeQuerySnapshot.docs) {
        if (joke.exists()) {
          const commentDocs = await getDocs(
            collection(db, "jokes", joke.id, "comments")
          );
          for (const comment of commentDocs.docs) {
            if (
              comment.exists() &&
              comment.data().commenter == session.user.id
            ) {
              await deleteDoc(comment.ref);
            }
          }
          if (joke.data().approvers.includes(session.user.id)) {
            await updateDoc(joke.ref, {
                approvers: arrayRemove(session.user.id),
                approveCount: increment(-1),
            })
          }
        }
      }

      // Delete user document in 'users' collection
      await deleteDoc(userDocRef);
      setFormState("complete");
    }
  };

  return (
    <div className="bg-white flex flex-col w-5/6 md:w-2/3 h-[20rem] md:h-[24rem] max-w-2xl p-4 items-center justify-center shadow-md border border-gray-300 space-y-4">
      {formState == "inputting" && (
        <>
          <span className="font-bold text-xl md:text-2xl text-center text-red-600">
            Delete your account?
          </span>
          <p className="font-light text-red-600 text-sm md:text-base">
            Doing so will permanently delete all data, including your jokes and
            comments.
          </p>

          <span className="font-light text-sm md:text-base">
            Confirm you want to delete your account by typing your name:{" "}
            <b>{session?.user.name}</b>
          </span>
          <div className="flex items-center justify-center">
            <input
              type="text"
              placeholder={session?.user.name}
              className="focus:outline-none md:text-lg w-full border p-2 border-black"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
            ></input>
          </div>
          <div className="flex justify-center items-center w-full pt-4">
            <div className="flex space-x-2">
              <button
                className="w-full p-4 font-light md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
                onClick={() => {
                  setFormState("inputting");
                  setOpenDeleteAccountForm(false);
                }}
              >
                Cancel
              </button>
              <button
                className={`w-full p-4 font-light md:text-xl bg-gray-100 border text-gray-400 ${
                  confirmName == session?.user.name &&
                  "text-red-600 bg-red-100 hover:bg-red-200 active:bg-red-300 hover-effect border-red-600"
                }`}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
      {formState == "deleting" && (
        <>
          <Spinner />
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            Deleting account...
          </span>
        </>
      )}
      {formState == "complete" && (
        <>
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            Your account is now permanently deleted.
          </span>
          <button
            className="p-4 font-medium md:text-xl text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 hover-effect border"
            onClick={() => {
              setFormState("inputting");
              setOpenDeleteAccountForm(false);
              signOut({
                callbackUrl: "/login",
              });
            }}
          >
            Sign out
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
              setOpenDeleteAccountForm(false);
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
