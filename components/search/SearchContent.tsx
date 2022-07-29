import { ReactElement, useEffect, useState } from "react";
import EnclosingHeader from "../misc/EnclosingHeader";
import {
  DuplicateIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";
import SkeletonSmallJoke from "../joke/SkeletonSmallJoke";
import SmallJoke from "../joke/SmallJoke";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import UserProfile from "../misc/UserProfile";
import { JokeData, UserData } from "../../types/firebase-db";

type SearchContentProps = {
  currentQuery: string;
  searchBy: string;
};

function SearchContent({
  currentQuery,
  searchBy,
}: SearchContentProps): ReactElement | null {
  const [isJokeLoading, setIsJokeLoading] = useState<boolean>(true);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [jokes, updateJokes] = useState<JokeData[]>([]);
  const [users, updateUsers] = useState<UserData[]>([]);

  const processQuery = (queryToBeProcessed: string): string[] | null => {
    const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    // Note: a single character is not allowed.
    if (queryToBeProcessed && queryToBeProcessed.length > 1) {
      return queryToBeProcessed.split(specialChars);
    }
    return null;
  };

  const KMPTable = (word: string): number[] => {
    const table = [0];
    let prefixIndex = 0;
    let suffixIndex = 1;

    while (suffixIndex < word.length) {
      if (word[prefixIndex] === word[suffixIndex]) {
        table[suffixIndex] = prefixIndex + 1;
        suffixIndex += 1;
        prefixIndex += 1;
      } else if (prefixIndex === 0) {
        table[suffixIndex] = 0;
        suffixIndex += 1;
      } else {
        prefixIndex = table[prefixIndex - 1];
      }
    }

    return table;
  };

  const KMPSearch = (text: string, word: string): boolean => {
    if (word.length === 0) {
      return false;
    }

    // Search is case-insensitive
    text = text.toLowerCase();
    word = word.toLowerCase();

    let textIndex = 0;
    let wordIndex = 0;

    const table = KMPTable(word);

    while (textIndex < text.length) {
      if (text[textIndex] === word[wordIndex]) {
        if (wordIndex === word.length - 1) {
          return true;
        }
        wordIndex += 1;
        textIndex += 1;
      } else if (wordIndex > 0) {
        wordIndex = table[wordIndex - 1];
      } else {
        textIndex += 1;
      }
    }

    return false;
  };

  const selectJokes = async (
    processedQuery: string[] | null
  ): Promise<void> => {
    if (!processedQuery) {
      return;
    }

    const selectedJokes: JokeData[] = [];

    const q = query(collection(db, "jokes"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      for (const keyword of processedQuery) {
        if (KMPSearch(data.title, keyword)) {
          selectedJokes.push({
            id: doc.id,
            comments: data.comments,
            image: data.image,
            mainText: data.mainText,
            owner: data.owner,
            punchline: data.punchline,
            timestamp: data.timestamp,
            title: data.title,
            value: data.value,
            approveCount: data.approveCount,
            approvers: data.approvers,
          });
          break;
        } else if (KMPSearch(data.title, keyword)) {
          selectedJokes.push({
            id: doc.id,
            comments: data.comments,
            image: data.image,
            mainText: data.mainText,
            owner: data.owner,
            punchline: data.punchline,
            timestamp: data.timestamp,
            title: data.title,
            value: data.value,
            approveCount: data.approveCount,
            approvers: data.approvers,
          });
          break;
        } else if (KMPSearch(data.title, keyword)) {
          selectedJokes.push({
            id: doc.id,
            comments: data.comments,
            image: data.image,
            mainText: data.mainText,
            owner: data.owner,
            punchline: data.punchline,
            timestamp: data.timestamp,
            title: data.title,
            value: data.value,
            approveCount: data.approveCount,
            approvers: data.approvers,
          });
          break;
        }
      }
    });

    updateJokes(selectedJokes);
    setIsJokeLoading(false);
  };
  const selectUsers = async (processedQuery: string[] | null): Promise<void> => {
    if (!processedQuery) {
      return;
    }

    const selectedUsers: UserData[] = [];

    const q = query(collection(db, "users"), orderBy("coins", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      for (const keyword of processedQuery) {
        if (KMPSearch(data.name, keyword)) {
          selectedUsers.push(data as UserData);
          break;
        } else if (KMPSearch(data.email, keyword)) {
          selectedUsers.push(data as UserData);
          break;
        }
      }
    });

    updateUsers(selectedUsers);
    setIsUserLoading(false);
  };

  useEffect(() => {
    const processedQuery = processQuery(currentQuery);
    selectJokes(processedQuery);
    selectUsers(processedQuery);

    return () => {
      setIsJokeLoading(true);
      setIsUserLoading(true);
      updateJokes([]);
      updateUsers([]);
    };
  }, [currentQuery]);

  return (
    <>
      {/* In case no jokes and no users were found */}
      {!isJokeLoading && !isUserLoading && jokes.length + users.length == 0 ? (
        <div className="flex flex-col justify-center items-center h-[28rem]">
          <QuestionMarkCircleIcon className="text-red-200 h-60 w-60 md:h-72 md:w-72" />
          <span className="text-xl font-light text-gray-400 mb-4">
            we could not find any results for "{currentQuery}".
          </span>
          <span className="font-lg font-light text-gray-400">
            • double-check your spelling.
          </span>
          <span className="font-lg font-light text-gray-400">
            • try different keyword.
          </span>
        </div>
      ) : (
        <>
          {(searchBy == "all" || searchBy == "jokes") && (
            <EnclosingHeader HeaderIcon={DuplicateIcon} headerText="Jokes">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {isJokeLoading
                  ? [...Array(4)].map((e, i) => <SkeletonSmallJoke key={i} />)
                  : jokes.map((joke, i) => (
                      <div key={i}>
                        <SmallJoke
                          id={joke.id}
                          title={joke.title}
                          mainText={joke.mainText}
                          image={joke.image}
                          approveCount={joke.approveCount}
                          value={joke.value}
                        />
                      </div>
                    ))}
              </div>
            </EnclosingHeader>
          )}
          {(searchBy == "all" || searchBy == "users") && (
            <EnclosingHeader HeaderIcon={UserCircleIcon} headerText="Users">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {isUserLoading ? (
                  <></>
                ) : (
                  users.map((user) => (
                    <UserProfile
                      key={user.id}
                      id={user.id}
                      name={user.name}
                      image={user.image}
                      followers={user.followers}
                      following={user.following}
                    />
                  ))
                )}
              </div>
            </EnclosingHeader>
          )}
        </>
      )}
    </>
  );
}

export default SearchContent;
