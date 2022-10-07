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
              layout="fixed"
              width={28}
              height={28}
              loading="eager"
              loader={() =>
                profileImage &&
                `http://localhost:3000/users/me/pp/${profileImage}`
              }
              src={
                profileImage
                  ? `http://localhost:3000/users/me/pp/${profileImage}`
                  : "/assets/img/42.png"
              }
              priority
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
              layout="fixed"
              width={28}
              height={28}
              loading="eager"
              priority
              loader={() =>
                profileImage &&
                `http://localhost:3000/users/me/pp/${profileImage}`
              }
              src={
                (profileImage &&
                  `http://localhost:3000/users/me/pp/${profileImage}`) ||
                "/assets/img/42.png"
              }
              className="rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};
