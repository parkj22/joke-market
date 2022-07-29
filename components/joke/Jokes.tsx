import { PlusIcon } from "@heroicons/react/outline";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { ReactElement, useEffect, useState } from "react";
import { db } from "../../firebase";
import Joke from "./Joke";
import SkeletonJoke from "./SkeletonJoke";

const QUERY_BATCH_SIZE = 10;

type JokesProps = {
  sortJokeBy: string;
};

function Jokes({ sortJokeBy }: JokesProps): ReactElement | null {
  const [fetchedJokes, setFetchedJokes] = useState<DocumentData[]>([]);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [following, setFollowing] = useState<string[] | null>(null);
  const [endOfList, setEndOfList] = useState<boolean>(false);
  const { data: session } = useSession();

  const fetchFollowers = async (
    userId: string | undefined
  ): Promise<string[]> => {
    if (userId == undefined) {
      return [];
    }
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().following;
    }
    return [];
  };

  const fetchInitialJokes = async (
    sortJokeBy: string
  ): Promise<DocumentData[]> => {
    setLoading(true);
    let q: Query<DocumentData>;
    if (sortJokeBy == "trending") {
      q = query(
        collection(db, "jokes"),
        orderBy("timestamp", "desc"),
        limit(QUERY_BATCH_SIZE)
      );
    } else if (sortJokeBy == "following") {
      if (!following || following.length <= 0) {
        setLoading(false);
        return [];
      }
      q = query(
        collection(db, "jokes"),
        where("owner", "in", following),
        orderBy("timestamp", "desc"),
        limit(QUERY_BATCH_SIZE)
      );
    } else if (sortJokeBy == "top") {
      q = query(
        collection(db, "jokes"),
        orderBy("approveCount", "desc"),
        limit(QUERY_BATCH_SIZE)
      );
    } else {
      q = query(
        collection(db, "jokes"),
        orderBy("timestamp", "desc"),
        limit(QUERY_BATCH_SIZE)
      );
    }
    const querySnapshot = await getDocs(q);
    setLoading(false);
    return querySnapshot.docs;
  };

  const fetchMoreJokes = async (
    sortJokeBy: string,
    lastVisible: DocumentData | null
  ): Promise<DocumentData[] | undefined> => {
    if (!lastVisible) {
      return;
    }
    let q: Query<DocumentData>;
    if (sortJokeBy == "trending") {
      q = query(
        collection(db, "jokes"),
        orderBy("timestamp", "desc"),
        limit(QUERY_BATCH_SIZE),
        startAfter(lastVisible)
      );
    } else if (sortJokeBy == "following") {
      if (!following || following.length <= 0) {
        setEndOfList(true);
        return [];
      }
      q = query(
        collection(db, "jokes"),
        where("owner", "in", following),
        orderBy("timestamp", "desc"),
        limit(QUERY_BATCH_SIZE),
        startAfter(lastVisible)
      );
    } else if (sortJokeBy == "top") {
      q = query(
        collection(db, "jokes"),
        orderBy("approveCount", "desc"),
        limit(QUERY_BATCH_SIZE),
        startAfter(lastVisible)
      );
    } else {
      q = query(
        collection(db, "jokes"),
        orderBy("timestamp", "desc"),
        limit(QUERY_BATCH_SIZE),
        startAfter(lastVisible)
      );
    }
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length <= 0) {
      setEndOfList(true);
    }

    return querySnapshot.docs;
  };

  useEffect(() => {
    fetchFollowers(session?.user.id).then((following) => {
      setFollowing(following);
    });
  }, []);
  useEffect(() => {
    fetchInitialJokes(sortJokeBy).then((docs) => {
      setFetchedJokes(docs);
      setLastVisible(docs[docs.length - 1]);
    });
    setEndOfList(false);
  }, [sortJokeBy, following]);

  return (
    <div className="flex flex-col">
      {loading ? (
        <>
          {[...Array(2)].map((e, i) => (
            <SkeletonJoke key={i} />
          ))}
        </>
      ) : (
        <>
          {fetchedJokes.length > 0 &&
            fetchedJokes.map((doc) => (
              <Joke
                key={doc.id}
                id={doc.id}
                title={doc.data().title}
                mainText={doc.data().mainText}
                punchline={doc.data().punchline}
                image={doc.data().image}
                owner={doc.data().owner}
                approveCount={doc.data().approveCount}
                approvers={doc.data().approvers}
                timestamp={doc.data().timestamp}
                value={doc.data().value}
                comments={doc.data().comments}
              />
            ))}
        </>
      )}

      {endOfList || (sortJokeBy == "following" && (!following || following.length <= 0)) || fetchedJokes.length <= 0 ? (
        <div className="w-full h-36 md:h-48 flex items-center justify-center">
          <span className="font-light text-lg md:text-xl">end of list.</span>
        </div>
      ) : (
        <button
          className="w-full h-36 md:h-48 flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 hover-effect"
          onClick={() => {
            fetchMoreJokes(sortJokeBy, lastVisible).then((newDocs) => {
              if (fetchedJokes && newDocs) {
                setFetchedJokes([...fetchedJokes, ...newDocs]);
                setLastVisible(newDocs[newDocs.length - 1]);
              }
            });
          }}
        >
          <PlusIcon className="h-6 w-6" />
          <span className="font-light text-lg md:text-xl">load more</span>
        </button>
      )}
    </div>
  );
}

export default Jokes;
