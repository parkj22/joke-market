import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { db } from "../../firebase";
import unauthenticatedUser from "../../public/unauthenticated-user.png";
import Spinner from "../misc/Spinner";

type CommentFormProps = {
  jokeId: string;
};

function CommentForm({ jokeId }: CommentFormProps): ReactElement | null {
  const { data: session } = useSession();
  const [comment, setComment] = useState<string>("");
  const [formState, setFormState] = useState<string>("inputting");
  const router = useRouter();

  const handleComment = async (): Promise<void> => {
    setFormState("uploading");

    if (session && jokeId) {
      const jokeDocRef = doc(db, "jokes", jokeId);
      const jokeDocSnap = await getDoc(jokeDocRef);
      if (jokeDocSnap.exists()) {
        await addDoc(collection(db, "jokes", jokeId, "comments"), {
          commenter: session.user.id,
          commenterImage: session.user.image,
          commenterName: session.user.name,
          comment: comment,
          timestamp: serverTimestamp(),
        })
          .then((document) => {
            console.log("Comment posted with ID: ", document.id);
          })
          .catch((e) => {
            console.error("Error occured while posting comment: ", e);
          });
        setFormState("complete");
        router.reload();
        return;
      }
    }
    setFormState("incomplete");
    router.reload();
  };

  return (
    <div className="flex flex-col bg-white shadow-md border border-gray-300">
      {formState == "inputting" && (
        <>
          <div className="flex items-center p-2">
            <span className="font-light text-xs mr-2">comment as </span>
            <Image
              className="rounded-full"
              src={session ? session.user.image : unauthenticatedUser}
              alt="User Image"
              width="20"
              height="20"
              layout="fixed"
            />
            <span className="ml-1 font-semibold text-xs">
              {session?.user?.name}
            </span>
          </div>
          <div className="px-2 pb-1 w-full">
            <textarea
              placeholder="What are your thoughts?"
              className="h-32 w-full border border-blue-100 focus:border-blue-300 p-2 focus:outline-none resize-none"
              value={comment}
              required
              onChange={(e) => {
                setComment(e.target.value);
              }}
            ></textarea>
          </div>
          <div className="flex justify-end bg-slate-100 border-t border-gray-300">
            <button
              className="p-2 border-l border-gray-300 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-sm font-light text-blue-800 hover-effect"
              onClick={handleComment}
            >
              comment
            </button>
          </div>
        </>
      )}
      {formState == "uploading" && (
        <div className="flex flex-col items-center py-10 space-y-2">
          <Spinner />
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            Uploading comment...
          </span>
        </div>
      )}
      {formState == "complete" && (
        <div className="flex flex-col items-center py-10 space-y-2">
          <span className="text-4xl md:text-6xl">😉</span>
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            Your comment is now posted!
          </span>
        </div>
      )}
      {formState == "incomplete" && (
        <div className="flex flex-col items-center py-10 space-y-2">
          <span className="text-4xl md:text-6xl">😩</span>
          <span className="font-semibold text-lg md:text-2xl text-center pb-2 w-full">
            Your comment could not be posted!
          </span>
        </div>
      )}
    </div>
  );
}

export default CommentForm;
