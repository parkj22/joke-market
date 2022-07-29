import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Feed from "../components/misc/Feed";
import Layout from "../components/Layout";
import LoginRedirect from "../components/misc/LoginRedirect";

export default function Home({ session }: { session: Session | any }) {
  if (!session) {
    return <LoginRedirect />
  }

  return (
    <main>
      <Feed />
    </main>
  );
}

Home.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
