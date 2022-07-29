import {
  signIn,
  getProviders,
  getSession,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";
import Image from "next/image";
import Footer from "../components/Footer";
import googleLogo from "../public/google.png";
import facebookLogo from "../public/facebook.png";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import { Session } from "next-auth";

type LoginProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
  session: Session | null;
};

export default function Login({ providers, session }: LoginProps): ReactElement | null {
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="mx-auto md:max-w-6xl flex flex-col md:flex-row h-full items-center space-y-16 md:space-y-0 md:space-x-6 pt-8 md:pt-0">
        <div className="text-center mt-12 md:mt-0 md:text-left w-3/4 pl-4">
          <h1 className="font-bold text-3xl py-4">joke market.</h1>
          <p className="font-light">Collect the best jokes around the world.</p>
        </div>
        <div className="flex flex-col bg-white rounded-xl shadow-lg w-96 md:w-[32rem] items-center pb-4">
          <h2 className="p-4 font-light text-lg md:text-xl">Social login</h2>
          {Object.values(providers ?? "").map((provider) => (
            <div
              key={provider.name}
              className="w-5/6 flex cursor-pointer border border-gray-400 rounded-xl mb-2 p-2 hover:bg-gray-200 hover-effect active:bg-gray-300"
              onClick={() => {
                signIn(provider.id, {
                  callbackUrl: "/",
                });
              }}
            >
              {provider.id === "google" && (
                <Image src={googleLogo} alt="Google" height={40} width={40} />
              )}
              {provider.id === "facebook" && (
                <Image
                  src={facebookLogo}
                  alt="Facebook"
                  height={40}
                  width={40}
                />
              )}
              <div className="w-full grid items-center">
                <span className="text-center">
                  Continue with {provider.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{ props: LoginProps}> => {
  const providers = await getProviders();
  const session = await getSession(context);
  return {
    props: {
      providers,
      session,
    },
  };
};
