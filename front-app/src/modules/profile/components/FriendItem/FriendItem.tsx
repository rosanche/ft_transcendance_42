import clsx from "clsx";
import IconMessage from "modules/common/components/_icons/message";
import { Button } from "modules/common/components/_ui/Button/Button";
import { Friend } from "modules/profile/types";
import Image from "next/image";

export const FriendItem = ({ username, status = "online" }: Friend) => {
  const state = {
    online: "En ligne",
    offline: "Hors Ligne",
    playing: "En pleine partie",
  };

  return (
    <div className="flex flex-1 flex-row">
      <div className="flex flex-1">
        <div className="w-7 h-7 shadow-sm mt-2 relative">
          <Image
            height={30}
            layout="fill"
            // objectFit="contain"
            src="/assets/img/pic.jpg"
            className="rounded-full"
          />
        </div>
        <div className="flex flex-1 flex-col ml-4">
          <span className="text-white text-base italic">{username}</span>
          <span
            className={clsx(
              "text-xs italic",
              status === "online" && "text-green",
              status === "offline" && "text-gray-light",
              status === "online" && "text-pink"
            )}
          >
            {state[status]}
          </span>
        </div>
      </div>
      <Button variant="icon">
        <IconMessage />
      </Button>
    </div>
  );
};
