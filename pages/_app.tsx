import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import React, { ReactNode } from "react";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import { NextComponentType } from "next";

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return (
    <>
      <Head>
        <title>joke market.</title>
        <meta
          name="description"
          content="Collect the best jokes around the world!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={pageProps.session}>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </>
  );
}

export default MyApp;
