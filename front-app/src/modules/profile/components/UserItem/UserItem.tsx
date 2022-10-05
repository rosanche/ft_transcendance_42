import { ApiFriend } from "modules/profile/types";
import Image from "next/image";

export const UserItem = ({
  pseudo,
  legend,
  profileImage,
  id,
  reverse = false,
}: ApiFriend & { reverse: boolean }) => {
  return (
    <div className="flex flex-row m-1">
      <div className="flex flex-1">
        {!reverse && (
          <div className="w-7 h-7 shadow-sm mt-3 relative">
            <Image
              layout="fill"
              // objectFit="contain"
              loader={() => profileImage || "/assets/img/42.png"}
              src={profileImage || "/assets/img/42.png"}
              priority={true}
              className="rounded-full"
            />
          </div>
        )}
        <div className="flex text-center content-center  m-3">
          <span className="text-white text-lg	font-weight: 500 italic">
            {pseudo}
          </span>
        </div>
        {reverse && (
          <div className="w-7 h-7 shadow-sm mt-3 relative">
            <Image
              layout="fill"
              // objectFit="contain"
              loader={() => profileImage || "/assets/img/42.png"}
              src={profileImage || "/assets/img/42.png"}
              priority={true}
              className="rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};
