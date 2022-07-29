import { ReactElement } from "react";

function SkeletonSmallJoke(): ReactElement | null {
  return (
    <div className="bg-white aspect-[2/3] shadow-md border border-gray-300 flex flex-col justify-center items-center space-y-4 p-2">
      {/* Title skeleton */}
      <div className="bg-slate-100 rounded-full h-6 w-1/2"></div>
      {/* Body skeleton */}
      <div className="flex flex-col w-full space-y-2 justify-center items-center">
        <div className="bg-slate-100 rounded-full h-4 w-11/12"></div>
        <div className="bg-slate-100 rounded-full h-4 w-11/12"></div>
        <div className="bg-slate-100 rounded-full h-4 w-3/5"></div>
      </div>
      {/* Image skeleton */}
      <div className="bg-slate-100 h-1/2 w-full"></div>
    </div>
  );
}

export default SkeletonSmallJoke;
