import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import React from "react";
import JokeForm from "../components/joke/JokeForm";
import Layout from "../components/Layout";
import LoginRedirect from "../components/misc/LoginRedirect";
import PublishingGuideline from "../components/misc/PublishingGuideline";

export default function Edit({ session }: { session: Session | any }) {
  if (!session) {
    return <LoginRedirect />;
  }

  return (
    <div className="flex-grow h-screen pt-6 overflow-y-auto scrollbar-hide">
      <div className="mx-auto max-w-md md:max-w-3xl">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-semibold text-xl md:text-2xl p-6">
            ✏️ publish your joke.
          </h1>
          <div className="mr-4">
            <button className="relative font-light px-4 py-3 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 hover-effect">
              <div className="absolute -top-1 -right-1 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 h-4 w-4 z-10 flex justify-center items-center hover-effect">
                <span className="font-semibold text-xs text-center text-white">0</span>
              </div>
              drafts
            </button>
          </div>
        </div>
        <hr className="py-2 border-gray-300"></hr>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <JokeForm />
          </div>
          <div className="hidden md:inline">
            <PublishingGuideline />
          </div>
        </div>
      </div>
    </div>
  );
}

Edit.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
