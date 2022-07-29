import { db } from "../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { DocumentParams, JokeData } from "../types/firebase-db";

/**
 * Fetches all document IDs in 'jokes' collection.
 * Serves as a helper function for getStaticPaths() in pages/jokes/[id].js.
 *
 * @returns An array of objects that contain all document IDs.
 */
export async function getAllJokesIds(): Promise<DocumentParams[]> {
  // TODO: Fetching only the document IDs from the collection would be more efficient.
  const querySnapshot = await getDocs(collection(db, "jokes"));
  return querySnapshot.docs.map((document) => {
    return {
      params: {
        id: document.id,
      },
    };
  });
}

/**
 * Gets data from the document with the matching 'id'.
 * Serves as a helper function for getStaticProps() in pages/jokes/[id].js.
 *
 * @param {string} id - Identifer for each jokes (Document ID in Cloud Firestore)
 * @returns An object containing all informations about the joke.
 */
export async function getJokeData(id: string): Promise<JokeData> {
  const docRef = doc(db, "jokes", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return {
    id: id,
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
  };
}
