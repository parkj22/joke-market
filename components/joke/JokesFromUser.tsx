import { doc, getDoc } from "firebase/firestore";
import React, { ReactElement, useEffect, useState } from "react";
import { db } from "../../firebase";
import { JokeData } from "../../types/firebase-db";
import SkeletonSmallJoke from "./SkeletonSmallJoke";
import SmallJoke from "./SmallJoke";

type JokesFromUserProps = {
  jokeIds: string[];
  userId: string;
};

function JokesFromUser({
  jokeIds,
  userId,
}: JokesFromUserProps): ReactElement | null {
  const [fetchedJokes, setFetchedJokes] = useState<JokeData[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchJokes = async (): Promise<void> => {
    setIsFetching(true);
    const fetchedData = [];
    for (var i = jokeIds.length - 1; i >= 0; i--) {
      const docRef = doc(db, "jokes", jokeIds[i]);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        fetchedData.push({
          id: jokeIds[i],
          comments: data!.comments,
          image: data!.image,
          mainText: data!.mainText,
          owner: data!.owner,
          punchline: data!.punchline,
          timestamp: data!.timestamp,
          title: data!.title,
          value: data!.value,
          approveCount: data!.approveCount,
          approvers: data!.approvers,
        });
      }
    }
    setFetchedJokes(fetchedData);
    setIsFetching(false);
  };

  useEffect(() => {
    fetchJokes();
  }, [userId]);

  return (
    <>
      {isFetching && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((e, i) => (
              <SkeletonSmallJoke key={i} />
            ))}
          </div>
        </>
      )}
      {!isFetching && fetchedJokes.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {fetchedJokes.map((data) => (
            <SmallJoke
              key={data.id}
              id={data.id}
              title={data.title}
              mainText={data.mainText}
              image={data.image}
              approveCount={data.approveCount}
              value={data.value}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default JokesFromUser;
