import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import IconAccept from "modules/common/components/_icons/accept";
import {
  IconAddFriend,
  IconBlock,
} from "modules/common/components/_icons/icons";
import IconMessage from "modules/common/components/_icons/message";
import IconRefuse from "modules/common/components/_icons/refuse";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useSocketContext } from "modules/common/context/SocketContext";
import { enumProfileQueryKeys } from "modules/profile/queries/keys";
import { useMyProfileQuery } from "modules/profile/queries/useMyProfileQuery";
import { ApiFriend, Friend, FriendType } from "modules/profile/types";
import Image from "next/image";
import { useEffect } from "react";

export const FriendItem = ({
  pseudo,
  status,
  type = "friend_request",
  profileImage,
  id,
}: ApiFriend & { type: FriendType }) => {
  const socket = useSocketContext();
  const queryClient = useQueryClient();
  const {
    data: { myfriends, friendReqSend },
  } = useMyProfileQuery();

  const state = {
    online: "En ligne",
    offline: "Hors Ligne",
    playing: "En pleine partie",
    blocked: "Bloqué(e)",
  };

  useEffect(() => {
    socket.on("request_friend", () => {
      console.log("$$passsssss");
      queryClient.invalidateQueries([enumProfileQueryKeys.MY_PROFILE]);
    });
    socket.on("block user infos", () => {
      console.log("$$passsssss");
      queryClient.invalidateQueries([enumProfileQueryKeys.MY_PROFILE]);
    });
    return () => {
      socket.off("request_friend");
      socket.off("block user infos");
    };
  }, []);

  const acceptFriendRequest = async () => {
    console.log("$$friend accepted", id);
    socket.emit("accept friend", id);
  };

  const blockUser = async () => {
    console.log("$$user blocked", id);
    socket.emit("block user", id);
  };

  const addFriend = async () => {
    console.log("$$friend added", id);
    socket.emit("dem friend", id);
  };

  const refuseFriendRequest = async () => {
    console.log("$$friend refused", id);
    await socket.emit("refuse friend", id);
  };
  console.log(
    "$$Bonjour",
    myfriends?.filter((friend) => friend.id === id)
  );

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
              (status === "online" || type === "game_request") && "text-pink",
              status === "blocked" && "text-red"
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
          <Button variant="icon" onClick={acceptFriendRequest}>
            <IconAccept />
          </Button>
          <Button variant="icon" onClick={refuseFriendRequest}>
            <IconRefuse />
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Button
            variant="icon"
            onClick={blockUser}
            color="active"
            disabled={status === "blocked"}
          >
            <IconBlock />
          </Button>
          {!myfriends?.filter((friend) => friend.id === id)[0] && (
            <Button
              variant="icon"
              onClick={addFriend}
              color="active"
              disabled={
                !!friendReqSend?.filter((friend) => friend.id === id)[0]
              }
            >
              <IconAddFriend />
            </Button>
          )}
          <Button variant="icon">
            <IconMessage />
          </Button>
        </div>
      )}
    </div>
  );
};
