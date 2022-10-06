import { ReactNode } from "react";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { FriendItem } from "modules/profile/components/FriendItem/FriendItem";
import {
  OtherMessage,
  MyMessage,
} from "modules/chat/components/Message/Message";
import { useChannelContext } from "modules/chat/context/ChannelContext";
import { useSocketContext } from "modules/common/context/SocketContext";
import {
  IconAddFriend,
  IconBlock,
} from "modules/common/components/_icons/icons";
import ActionsChannel from "../ActionsChannel/ActionsChannel";

type form = {
  idSend: number;
  idReceive: number;
  texte: string;
};

type Channel = {
  id: number;
  name: string;
  private: boolean;
  user: boolean;
  admin: boolean;
  owner: boolean;
  password: boolean;
};
interface Props {
  key: string;
  channel: Channel;
}

export const TitreChannel = () => {
  const { chatName, changeChatName } = useChannelContext();
  return (
    <span className="text-white font-medium text-2xl text-center leading-[3rem]">
      <span>
        {chatName.name}
        {chatName.admin && chatName.owner && (
          <span className="ml-1">(owner)</span>
        )}
        {chatName.admin && !chatName.owner && <span>(admin)</span>}
        <ActionsChannel />
      </span>
    </span>
  );
};
