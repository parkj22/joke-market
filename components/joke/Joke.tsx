import { DotsHorizontalIcon, CheckIcon } from "@heroicons/react/outline";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { ReactElement, useEffect, useState } from "react";
import { db } from "../../firebase";
import moment from "moment";
import { useRouter } from "next/router";
import { JokeData, UserData } from "../../types/firebase-db";
import { useSession } from "next-auth/react";

function Joke({
  id,
  title,
  mainText,
  punchline,
  image,
  owner,
  approveCount,
  approvers,
  timestamp,
}: JokeData): ReactElement | null {
  const [ownerData, setOwnerData] = useState<UserData | null>(null);
  const router = useRouter();
  const [approved, setApproved] = useState<boolean>(false);
  const [clientApproveCount, setClientApproveCount] =
    useState<number>(approveCount);
  const [approvalUpToDate, setApprovalUpToDate] = useState<boolean>(false);
  const { data: session } = useSession();

  const routeToJokePage = (): void => {
    router.push(`/jokes/${id}`);
  };
  const routeToOwnerPage = (): void => {
    router.push(`/users/${owner}`);
  };

  const getOwnerData = async () => {
    const docSnap = await getDoc(doc(db, "users", owner));
    if (docSnap.exists()) {
      setOwnerData(docSnap.data() as UserData);
    } else {
      console.error("Owner not found in user documents: " + owner);
    }
  };

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
    getOwnerData();
    if (session) {
      setApproved(approvers.includes(session.user.id));
      setApprovalUpToDate(true);
    }
  }, []);

  return (
    <div className="flex bg-white min-h-[20rem] shadow-md border border-gray-300 mb-4 max-w-md md:max-w-lg">
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
              {ownerData && (
                <Image
                  className="rounded-full"
                  src={ownerData.image}
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
                {ownerData?.name}
              </span>
              <span className="ml-2 text-xs font-light">
                published {moment(timestamp.toDate()).fromNow()}
              </span>
            </div>
          </div>
          <button
            className="p-2 hover:bg-slate-100 active:bg-slate-200 hover-effect"
            onClick={routeToJokePage}
          >
            <DotsHorizontalIcon className="h-4" />
          </button>
        </div>
        <hr className="mx-2"></hr>
        <div className="my-2 px-2 space-y-4">
          <h1 className="text-lg cursor-pointer" onClick={routeToJokePage}>
            {title}
          </h1>
          {mainText && <p className="font-light">{mainText}</p>}
          {punchline && <h1 className="font-semibold">{punchline}</h1>}
        </div>
        {image && (
          <div className="relative h-56 md:h-96 overflow-hidden">
            <Image src={image} objectFit="cover" layout="fill" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Joke;
