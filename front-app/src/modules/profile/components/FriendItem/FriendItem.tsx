import clsx from "clsx";
import IconAccept from "modules/common/components/_icons/accept";
import IconMessage from "modules/common/components/_icons/message";
import IconRefuse from "modules/common/components/_icons/refuse";
import { Button } from "modules/common/components/_ui/Button/Button";
import { ApiFriend, Friend, FriendType } from "modules/profile/types";
import Image from "next/image";

export const FriendItem = ({
  pseudo,
  status,
  type = "friend_request",
  profileImage,
}: ApiFriend & { type: FriendType }) => {
  const state = {
    online: "En ligne",
    offline: "Hors Ligne",
    playing: "En pleine partie",
  };

  return (
    <div className="flex flex-row my-3">
      <div className="flex flex-1">
        <div className="w-7 h-7 shadow-sm mt-2 relative">
          <Image
            height={30}
            layout="fill"
            // objectFit="contain"
            src={profileImage || "/assets/img/42.png"}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col ml-4">
          <span className="text-white text-base italic">{pseudo}</span>
          <span
            className={clsx(
              "text-xs italic",
              (status === "online" || type === "friend_request") &&
                "text-green",
              status === "offline" && "text-gray-light",
              (status === "online" || type === "game_request") && "text-pink"
            )}
          >
            {type === "friend"
              ? state[status]
              : type === "friend_request"
              ? "Demande d'ami"
              : "Demande de partie"}
          </span>
        </div>
      </div>

      {type === "friend_request" ? (
        <div className="flex ml-2 space-x-1">
          <Button variant="icon">
            <IconAccept />
          </Button>
          <Button variant="icon">
            <IconRefuse />
          </Button>
        </div>
      ) : (
        <Button variant="icon">
          <IconMessage />
        </Button>
      )}
    </div>
  );
};
