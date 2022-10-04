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
import {
  ApiFriend,
  Friend,
  FriendType,
  UserStatus,
} from "modules/profile/types";
import Image from "next/image";
import { useEffect, useState } from "react";

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
              height={30}
              layout="fill"
              // objectFit="contain"
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
              height={30}
              layout="fill"
              // objectFit="contain"
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
