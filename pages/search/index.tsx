import { getSession } from "next-auth/react";
import LargeSearchBar from "../../components/search/LargeSearchBar";
import Layout from "../../components/Layout";
import LoginRedirect from "../../components/misc/LoginRedirect";
import SearchByBar from "../../components/search/SearchByBar";
import { ReactNode, useState } from "react";
import { DocumentSearchIcon } from "@heroicons/react/solid";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";

export default function Search({ session }: { session: Session | null }) {
  if (!session) {
    return <LoginRedirect />;
  }

  const [searchBy, setSearchBy] = useState<string>("all");

  return (
    <div className="flex-grow min-h-screen pt-6 overflow-y-auto scrollbar-hide">
      <div className="mx-auto max-w-xs sm:max-w-md md:max-w-3xl space-y-2">
        <LargeSearchBar currentQuery="" />
        <SearchByBar searchBy={searchBy} setSearchBy={setSearchBy} />

        {/* Initial search content area */}
        <div className="flex flex-col justify-center items-center h-[28rem]">
            <DocumentSearchIcon className="text-gray-300 h-72 w-72 md:h-96 md:w-96"/>
            <span className="text-xl font-light text-gray-400">find your next joke.</span>
        </div>
      </div>
    </div>
  );
}

Search.getLayout = function getLayout(page: ReactNode) {
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
