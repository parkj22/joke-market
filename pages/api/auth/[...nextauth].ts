import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { signIn } from "next-auth/react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user }) {
      // Query signed in user in Firebase
      const userDocRef = doc(db, "users", user.id);
      const userDocSnap = await getDoc(userDocRef);

      // Create new user's document
      if (!userDocSnap.exists()) {
        try {
          await setDoc(userDocRef, {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            jokes: [],
            coins: 500,
            followers: [],
            following: [],
          });
        } catch (e) {
          console.log("Error adding document: ", e);
        }
      }

      // Update existing user's document
      else {
        try {
          await setDoc(
            userDocRef,
            {
              name: user.name,
              email: user.email,
              image: user.image,
            },
            { merge: true }
          );
        } catch (e) {
          console.log("Error adding document: ", e);
        }
      }
      return true;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
        }
        return token;
    },
  },
  secret: process.env.JWT_SECRET,
});
