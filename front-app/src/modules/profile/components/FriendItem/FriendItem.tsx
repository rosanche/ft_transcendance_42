import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useChannelContext } from "modules/chat/context/ChannelContext";
import IconAccept from "modules/common/components/_icons/accept";
import IconAdmin from "modules/common/components/_icons/admin";
import IconEye from "modules/common/components/_icons/eye";
import {
  IconAddFriend,
  IconBlock,
  IconGame,
  IconMute,
} from "modules/common/components/_icons/icons";
import IconMessage from "modules/common/components/_icons/message";
import IconRefuse from "modules/common/components/_icons/refuse";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useSocketContext } from "modules/common/context/SocketContext";
import { EnumRoutes } from "modules/common/routes";
import { enumProfileQueryKeys } from "modules/profile/queries/keys";
import { useMyProfileQuery } from "modules/profile/queries/useMyProfileQuery";
import {
  ApiFriend,
  Friend,
  FriendType,
  UserStatus,
} from "modules/profile/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useMemo, useState } from "react";

interface UsersStatus {
  id: number;
  status: UserStatus;
}

export const FriendItem = ({
  pseudo,
  type = "friend_request",
  isBlocked,
  isIn = "friend",
  channelId = 0,
  profileImage,
  id,
  isChangeOnMember,
}: ApiFriend & {
  type: FriendType;
  isBlocked: boolean;
  isIn?: "channel" | "notification" | "friend";
  channelId?: number;
  isChangeOnMember?: boolean;
}) => {
  const socket = useSocketContext();
  const { chatName, changeChatName } = useChannelContext();
  const queryClient = useQueryClient();
  const { data: myProfil } = useMyProfileQuery();
  const [status, setStatus] = useState<UserStatus>("offline");

  const router = useRouter();

  const state = {
    online: "En ligne",
    offline: "Hors Ligne",
    playing: "En pleine partie",
    blocked: "Bloqué(e)",
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.on("request_friend", () => {
      queryClient.invalidateQueries([enumProfileQueryKeys.MY_PROFILE]);
    });
    socket.on("block user infos", () => {
      queryClient.invalidateQueries([enumProfileQueryKeys.MY_PROFILE]);
    });
    socket.on("list status", (usersStatus: UsersStatus[]) => {
      setStatus(usersStatus?.find((user) => user.id === id).status);
    });

    socket.emit("Get status");

    return () => {
      socket.off("request_friend");
      socket.off("block user infos");
      socket.off("list status");
    };
  }, [socket]);

  const acceptFriendRequest = async () => {
    socket.emit("accept friend", id);
  };

  const inviteUserChannel = async () => {
    socket.emit("invite channel", { inviteId: id, channelId: channelId });
  };

  const BanUserChannel = () => {
    socket.emit("banUserChannel", { UserbanId: id, channelId: channelId });
  };

  const MuteUserChannel = () => {
    socket.emit("muteUserChannel", { UserbanId: id, channelId: channelId });
  };

  const NewAdminUserChannel = () => {
    socket.emit("newAdminUserChannel", { UserbanId: id, channelId: channelId });
  };

  const NewOwnerUserChannel = () => {
    socket.emit("NewOwnerUserChannel", { UserId: id, channelId: channelId });
  };

  const blockUser = async () => {
    socket.emit("Get status");
    socket.emit("block user", id);
  };

  const addFriend = async () => {
    socket.emit("dem friend", id);
  };

  const refuseFriendRequest = async () => {
    socket.emit("refuse friend", id);
  };

  const urlImage = useMemo(
    () => profileImage && `http://localhost:3000/users/me/pp/${profileImage}`,
    [profileImage]
  );

  return (
    <div className="flex flex-row my-3">
      <div
        className="flex flex-1 cursor-pointer"
        onClick={() => router.push(`${EnumRoutes.USERS}/${id}`)}
      >
        <div className="w-7 h-7 shadow-sm mt-2 relative">
          <Image
            layout="fixed"
            width={28}
            height={28}
            loading="eager"
            loader={() => urlImage}
            src={urlImage != null ? urlImage : "/assets/img/42.png"}
            priority
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
              isBlocked && "text-red"
            )}
          >
            {type === "friend" && isIn !== "notification" && state[status]}
            {isIn === "notification" &&
              (type === "friend_request"
                ? "Demande d'ami"
                : "Demande de partie")}
          </span>
        </div>
      </div>

      {id === myProfil?.id ? (
        <></>
      ) : type === "friend_request" ? (
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
          {isIn !== "channel" &&
            (status !== "playing" ? (
              <Button
                variant="icon"
                onClick={() =>
                  router.push({
                    pathname: EnumRoutes.GAME,
                    query:
                      type === "game_request" ? `INVITE=${id}` : `CREATE=${id}`,
                  })
                }
                color="active"
              >
                <IconGame />
              </Button>
            ) : (
              <Button
                variant="icon"
                onClick={() =>
                  router.push({
                    pathname: EnumRoutes.GAME,
                    query: { SPECTATOR: id },
                  })
                }
                color="active"
              >
                <IconEye />
              </Button>
            ))}
          {isIn !== "channel" && (
            <Button
              variant="icon"
              onClick={blockUser}
              color="active"
              disabled={isBlocked}
            >
              <IconBlock />
            </Button>
          )}
          {!myProfil?.myfriends?.filter((friend) => friend.id === id)[0] &&
            isIn !== "channel" && (
              <Button
                variant="icon"
                onClick={addFriend}
                color="active"
                disabled={
                  !!myProfil?.friendReqSend?.filter(
                    (friend) => friend.id === id
                  )[0]
                }
              >
                <IconAddFriend />
              </Button>
            )}
          {isIn !== "channel" && (
            <Button
              variant="icon"
              onClick={() =>
                router.push({
                  pathname: EnumRoutes.CHAT,
                  query: { userId: id, pseudo },
                })
              }
            >
              <IconMessage />
            </Button>
          )}
          {isIn === "channel" && !isChangeOnMember && (
            <Button variant="icon" onClick={inviteUserChannel}>
              <IconAddFriend />
            </Button>
          )}

          {/* Recuperer ici l info s il est admin ou owner en la recuperant direct avec ton context, et il faudra dans le bouton "nouveau owner", changer le owner et quit juste apres */}
          {isChangeOnMember && (
            <>
              <Button variant="icon" color="active" onClick={BanUserChannel}>
                <IconBlock />
              </Button>
              <Button variant="icon" onClick={MuteUserChannel}>
                <IconMute />
              </Button>
              {chatName?.owner && (
                <>
                  <Button variant="icon" onClick={NewAdminUserChannel}>
                    <IconAdmin />
                  </Button>
                  <Button variant="icon" onClick={NewOwnerUserChannel}>
                    new owner
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
