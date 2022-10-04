import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { FriendItem } from "modules/profile/components/FriendItem/FriendItem";
import { useChannelContext } from "modules/chat/context/ChannelContext";
import React, { useState, useRef, useEffect } from "react";

type form = {
  idSend: number;
  idReceive: number;
  texte: string;
};

type user = {
  id: number;
  pseudo: string;
  stastu: number;
  blocked: boolean;
  myblocked: boolean;
};

interface Props {
  user: user;
}

export const UserMp = (info: Props) => {
  const [cha_mp, setCha_mp] = useState<string>("default");

  //const { data: users, isLoading, status } = useUsersQuery();
  return (
    <div className="ml-2">
      <div className="bg-white text-black text-xl rounded-md m-0.5">
        <div className="my-1">
          <span className="mx-2">{info.user?.pseudo}</span>
        </div>
      </div>
    </div>
  );
};
