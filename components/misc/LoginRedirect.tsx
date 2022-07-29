import { useRouter } from "next/router";
import React, { ReactElement } from "react";

function LoginRedirect(): ReactElement | null {
  const router = useRouter();

  return (
    <div className="h-screen flex justify-center items-center space-x-4">
      <h1>Unauthenticated browsing is not available at the moment.</h1>
      <button
        className="text-md font-semibold border border-green-300 rounded-xl mb-2 p-4 bg-green-100 hover:bg-green-200 hover-effect active:bg-green-300"
        onClick={() => {
          router.push("/login");
        }}
      >
        Login to continue
      </button>
    </div>
  );
}

export default LoginRedirect;
