import { useRouter } from "next/router";
import React, { ReactElement } from "react";

function LoginRedirect(): ReactElement | null {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
      <div className="flex flex-col items-center space-y-2 border-b pb-4 md:border-b-0 md:pb-0 md:pr-8 md:border-r border-gray-300">
        <h1 className="font-bold text-3xl md:text-4xl text-center px-2">
          Welcome!
        </h1>
        <p className="font-light md:text-lg text-center">
          {"Authentication is required for browsing the market."}
        </p>
      </div>
      <button
        className="text-lg md:text-xl text-green-900 font-light border border-green-300 mb-2 p-4 px-6 bg-green-100 hover:bg-green-200 hover-effect active:bg-green-300"
        onClick={() => {
          router.push("/login");
        }}
      >
        Login
      </button>
    </div>
  );
}

export default LoginRedirect;
