import Layout from "../../components/Layout";
import { getAllUsersIds, getUserData } from "../../lib/users";
import Image from "next/image";
import JokesFromUser from "../../components/joke/JokesFromUser";
import { CheckIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { CurrencyDollarIcon } from "@heroicons/react/solid";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { UserData } from "../../types/firebase-db";
import { ParsedUrlQuery } from "querystring"

type UserPageProps = {
  data: UserData,
};

interface Params extends ParsedUrlQuery {
  id: string;
}

function UserPage({ data }: UserPageProps): ReactElement | null {
  const { data: session } = useSession();
  const [followingStatus, setFollowingStatus] = useState<boolean>(false);
  const [followersCache, setFollowersCache] = useState<number>(data.followers.length);

  const handleFollow = async (): Promise<void> => {
    if (session) {
      try {
        await updateDoc(doc(db, "users", session.user.id), {
          following: arrayUnion(data.id),
        });
        await updateDoc(doc(db, "users", data.id), {
          followers: arrayUnion(session.user.id),
        });
      } catch (e) {
        console.error("Error handling following/followers: ", e);
      }
    }
    setFollowingStatus(true);
    setFollowersCache(followersCache + 1);
  };
  const handleUnfollow = async (): Promise<void> => {
    if (session) {
      try {
        await updateDoc(doc(db, "users", session.user.id), {
          following: arrayRemove(data.id),
        });
        await updateDoc(doc(db, "users", data.id), {
          followers: arrayRemove(session.user.id),
        });
      } catch (e) {
        console.error("Error handling unfollowing/unfollowers: ", e);
      }
    }
    setFollowingStatus(false);
    setFollowersCache(followersCache - 1);
  };
  const isFollowing = async (dataId: string): Promise<boolean> => {
    if (session) {
      const docRef = doc(db, "users", session.user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap.data().following.includes(dataId)) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    isFollowing(data.id).then((status) => {
        setFollowingStatus(status);
    });
  }, [data.id]);

  return (
    <div className="flex flex-col mx-auto max-w-lg md:max-w-3xl pt-6 overflow-y-auto scrollbar-hide space-y-4">
      <div className="my-6 md:mx-16 md:my-12 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
        <Image
          className="rounded-full"
          src={data.image}
          alt="User Image"
          height={144}
          width={144}
        />
        <div className="flex flex-col items-center space-y-4">
          <span className="font-light text-3xl">{data.name}</span>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col justify-end md:flex-row md:space-x-1 items-center">
              <span className="font-semibold text-lg">{data.jokes.length}</span>
              <span className="font-light">jokes</span>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-1 items-center">
              <span className="font-semibold text-lg">{followersCache}</span>
              <span className="font-light">followers</span>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-1 items-center">
              <span className="font-semibold text-lg">
                {data.following.length}
              </span>
              <span className="font-light">following</span>
            </div>
          </div>
        </div>
        <div>
          {session?.user.id == data.id ? (
            <div className="p-4 flex items-center border border-yellow-300 bg-yellow-50 space-x-1 hover:bg-yellow-100 active:bg-yellow-200 hover-effect">
              <CurrencyDollarIcon
                className="text-yellow-400"
                height={30}
                width={30}
              />
              <span className="text-lg font-semibold text-yellow-900 text-center">
                {data.coins}
              </span>
            </div>
          ) : (
            <div>
              {followingStatus ? (
                <button
                  className="p-4 flex items-center border border-green-300 bg-green-100 hover:bg-green-200 active:bg-green-300 hover-effect"
                  onClick={handleUnfollow}
                >
                  <span className="text-lg font-light text-green-900 text-center">
                    following
                  </span>
                  <CheckIcon
                    className="text-green-600"
                    height={20}
                    width={20}
                  />
                </button>
              ) : (
                <button
                  className="p-4 px-6 flex items-center border border-blue-300 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 hover-effect"
                  onClick={handleFollow}
                >
                  <span className="text-lg font-light text-blue-900 text-center">
                    follow
                  </span>
                  <ChevronRightIcon
                    className="text-blue-600"
                    height={20}
                    width={20}
                  />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <hr></hr>
      <div className="mx-auto">
        <span className="font-light text-lg">collection.</span>
      </div>
      <div className="min-h-screen w-full">
        <JokesFromUser jokeIds={data.jokes} userId={data.id} />
      </div>
    </div>
  );
}

UserPage.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllUsersIds();
  console.log(paths);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<UserPageProps, Params> = async ({ params }) => {
  const userData = await getUserData(params!.id);
  if (userData.jokes == undefined) {
    userData.jokes = [];
  }
  return {
    props: {
      data: userData,
    },
  };
};

export default UserPage;
