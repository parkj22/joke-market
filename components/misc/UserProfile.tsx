import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { ReactElement } from "react";

type UserProfileProps = {
  id: string,
  name: string,
  image: string,
  followers: string[],
  following: string[],
}

function UserProfile({ id, name, image, followers, following }: UserProfileProps): ReactElement | null {
  const router = useRouter();

  const routeToUserPage = (): void => {
    router.push(`/users/${id}`);
  };

  return (
    <div
      className="bg-white aspect-[3/2] shadow-md border border-gray-300 flex justify-center items-center cursor-pointer overflow-hidden"
      onClick={routeToUserPage}
    >
      <div className="flex h-full items-center flex-1">
        <div className="bg-slate-100 h-full w-1/2 flex justify-center items-center">
          <Image
            className="rounded-full"
            src={image}
            height={120}
            width={120}
          />
        </div>
        <div className="flex flex-col justify-center items-center space-y-4 flex-1">
          <span className="text-xl md:text-2xl font-light hover:underline">{name}</span>
          <div className="space-x-2">
            <span className="text-sm md:text-base font-light">
              <b className="">{followers.length}</b> followers
            </span>
            <span className="text-sm md:text-base font-light">
              <b className="">{following.length}</b> following
            </span>
          </div>
          <div className="flex items-center hover:underline">
            <span className="font-light md:text-lg">view collection</span>
            <ChevronRightIcon className="text-center" height={20} width={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
