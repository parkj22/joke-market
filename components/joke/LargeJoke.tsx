import { CheckIcon } from "@heroicons/react/outline";
import {
  doc,
  updateDoc,
  increment,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { db } from "../../firebase";
import { UserData } from "../../types/firebase-db";

type LargeJokeProps = {
  id: string;
  title: string;
  mainText: string | null;
  punchline: string | null;
  image: string | null;
  owner: UserData | null;
  ownerId: string;
  approveCount: number;
  approvers: string[];
  timestamp: string;
};

function LargeJoke({
  id,
  title,
  mainText,
  punchline,
  image,
  owner,
  ownerId,
  approveCount,
  approvers,
  timestamp,
}: LargeJokeProps): ReactElement | null {
  const router = useRouter();
  const routeToOwnerPage = (): void => {
    router.push(`/users/${ownerId}`);
  };
  const [approved, setApproved] = useState<boolean>(false);
  const [clientApproveCount, setClientApproveCount] =
    useState<number>(approveCount);
  const [approvalUpToDate, setApprovalUpToDate] = useState<boolean>(false);
  const { data: session } = useSession();

  const updateApprove = async (): Promise<boolean | null> => {
    if (!approvalUpToDate) {
      return null;
    }
    const docRef = doc(db, "jokes", id);

    // Do reverse of current state
    if (approved) {
      await updateDoc(docRef, {
        approveCount: increment(-1),
        approvers: arrayRemove(session?.user.id),
      });
      return false;
    } else {
      await updateDoc(docRef, {
        approveCount: increment(1),
        approvers: arrayUnion(session?.user.id),
      });
      return true;
    }
  };

  useEffect(() => {
    if (session) {
      setApproved(approvers.includes(session.user.id));
      setApprovalUpToDate(true);
    }
  }, [approvers]);

  return (
    <div className="min-h-[24rem] flex bg-white border border-gray-300 shadow-md mb-4">
      {/* Sidebar: Approve button and More button */}
      <div className="flex flex-col bg-slate-100 p-2 items-center">
        <div className="flex flex-col items-center">
          <span
            className={`w-full font-semibold md:text-lg p-2 text-center border-b border-gray-400 ${
              approved && "text-blue-600"
            }`}
          >
            {clientApproveCount}
          </span>
          <button
            className="mt-2 p-1 hover:bg-slate-200 active:bg-slate-300 hover-effect"
            onClick={() => {
              if (approved) {
                setClientApproveCount(clientApproveCount - 1);
              } else {
                setClientApproveCount(clientApproveCount + 1);
              }
              setApproved(!approved);
              updateApprove().then((res) => {
                if (res != null) {
                  setApproved(res);
                }
              });
            }}
          >
            <CheckIcon
              className={`h-6 md:h-7 ${approved && "text-blue-600"}`}
            />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-full">
        {/* Owner Image, Owner name, Timestamp, */}
        <div className="py-1 px-2 flex items-center justify-between">
          <div className="flex items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={routeToOwnerPage}
            >
              {owner && (
                <Image
                  className="rounded-full"
                  src={owner.image}
                  alt="Owner Image"
                  width="25"
                  height="25"
                  layout="fixed"
                />
              )}
            </div>
            <div className="p-2 flex">
              <span
                className="font-semibold text-xs pr-2 border-r border-black cursor-pointer hover:underline"
                onClick={routeToOwnerPage}
              >
                {owner?.name}
              </span>
              <span className="ml-2 text-xs font-light">
                published {moment(timestamp).fromNow()}
              </span>
            </div>
          </div>
        </div>
        <hr className="mx-2"></hr>
        <div className="my-2 px-2 space-y-4">
          <h1 className="text-lg md:text-xl">{title}</h1>
          {mainText && <p className="font-light md:text-lg">{mainText}</p>}
          {punchline && (
            <h1 className="font-semibold md:text-lg">{punchline}</h1>
          )}
        </div>
        {image && (
          <div className="relative h-56 md:h-96 overflow-hidden mb-4">
            <Image src={image} alt="Joke Image" objectFit="contain" layout="fill" />
          </div>
        )}
      </div>
    </div>
  );
}

export default LargeJoke;
