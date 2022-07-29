// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_BufxwzndBnA2r3dRSNQpHcHtBHIXNJI",
  authDomain: "joke-market-c2865.firebaseapp.com",
  projectId: "joke-market-c2865",
  storageBucket: "joke-market-c2865.appspot.com",
  messagingSenderId: "159654668698",
  appId: "1:159654668698:web:7ae704029372bf6baf7223",
  measurementId: "G-JVGNR4PR7B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };