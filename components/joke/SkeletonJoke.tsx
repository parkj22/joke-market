import { ReactElement } from "react";

function SkeletonJoke(): ReactElement | null {
  return (
    <div className="flex bg-white shadow-md border border-gray-300 min-h-[16rem] md:min-h-[24rem] mb-4 max-w-md md:max-w-lg">
      <div className="flex flex-col bg-slate-100 w-[3rem] items-center">
        <span className="p-6 border-b border-gray-200"> </span>
      </div>

      <div className="flex flex-col w-full">
        <div className="py-1 px-2 flex items-center justify-between">
          {/* Skeleton profile pic and name*/}
          <div className="flex items-center space-x-2 p-1">
            <div className="bg-slate-100 rounded-full h-7 w-7"></div>
            <div className="bg-slate-100 rounded-full h-5 w-28"></div>
          </div>
        </div>
        <hr className="mx-2 mb-2"></hr>
        <div className="my-2 px-2 space-y-2">
          {/* Title skeleton */}
          <div className="bg-slate-100 rounded-full h-7 w-56 mb-6"></div>

          {/* Body skeleton */}
          <div className="bg-slate-100 rounded-full h-5 w-96"></div>
        </div>
        {/* Image skeleton */}
        <div className="bg-slate-200 h-full md:h-full"></div>
      </div>
    </div>
  );
}

export default SkeletonJoke;
