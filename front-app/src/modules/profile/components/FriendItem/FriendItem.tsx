import clsx from "clsx";
import Image from "next/image";
import { PropsWithChildren } from "react";
import { HeaderTitle } from "../HeaderTitle/HeaderTitle";

interface Props {
  // imgUrl: string;
  username: string;
  status: "online" | "offline" | "playing";
}

export const FriendItem = ({ username, status }: Props) => {
  const state = {
    online: "En ligne",
    offline: "Hors Ligne",
    playing: "En pleine partie",
  };

  return (
    <div>
      <div className="w-7 h-7 shadow-sm relative">
        <Image
          height={30}
          layout="fill"
          // objectFit="contain"
          src="/assets/img/pic.jpg"
          className="rounded-full"
        />
      </div>
      <div>
        <span>{username}</span>
        <span></span>
      </div>
    </div>
  );
};
