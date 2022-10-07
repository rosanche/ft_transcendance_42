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
  IconLock,
} from "modules/common/components/_icons/icons";
import ActionsChannel from "../ActionsChannel/ActionsChannel";
import { useModeChannelMpContext } from "modules/chat/context/ModeChannelMpContext";

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
  const { chatName } = useChannelContext();
  const { cha_mp } = useModeChannelMpContext();
  return (
    <div className="text-white justify-center align-middle flex flex-col font-medium text-2xl text-center ">
      {
        chatName.name && chatName.id  &&
      <div className="flex flex-row justify-center align-middle ">
        {chatName?.name}
        {chatName.private && <IconLock />}
        {chatName.admin && chatName.owner && (
          <span className="ml-1">(owner)</span>
        )}
        {chatName.admin && !chatName.owner && <span className="ml-1">(admin)</span>}
        {!chatName.admin && !chatName.owner && chatName.user &&<span className="ml-1">(user)</span> }
        {!chatName.admin && !chatName.owner && !chatName.user &&<span className="ml-1">(no join)</span> } 
            {
              cha_mp === "channel" &&
              <ActionsChannel />
            }</div>
          } 
    </div>
  );
};
