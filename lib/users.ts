import { db } from "../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { DocumentParams, UserData } from "../types/firebase-db";

/**
 * Fetches all document IDs in 'users' collection.
 * Serves as a helper function for getStaticPaths() in pages/users/[id].js.
 *
 * @returns An array of objects that contain all document IDs.
 */
export async function getAllUsersIds(): Promise<DocumentParams[]> {
  // TODO: Fetching only the document IDs from the collection would be more efficient.
  const querySnapshot = await getDocs(collection(db, "users"));
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
 * Serves as a helper function for getStaticProps() in pages/users/[id].js.
 *
 * @param {String} id - Identifer for each users (Document ID in Cloud Firestore)
 * @returns An object containing all informations about the user.
 */
export async function getUserData(id: string): Promise<UserData> {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return {
    id: id,
    name: data!.name,
    jokes: data!.jokes,
    image: data!.image,
    following: data!.following,
    followers: data!.followers,
    email: data!.email,
    coins: data!.coins,
  };
}
