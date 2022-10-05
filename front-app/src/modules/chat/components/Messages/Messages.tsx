import { useChannelContext } from "modules/chat/context/ChannelContext";
import React from "react";
import { useModeChannelMpContext } from "modules/chat/context/ModeChannelMpContext";
import { MessagesMp } from "./MessagesMp";
import { MessagesChannel } from "./MessagesChannel";
import { users, form, pass, ban, channel } from "modules/chat/types";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";

interface Props {
  msg: form[];
  msgMp: form[];
  idme: number;
}

const Messages = (a: Props) => {
  const { chatName, changeChatName } = useChannelContext();
  const { cha_mp, changeCha_mp } = useModeChannelMpContext();

  return (
    <div>
      {cha_mp === "channel" && (
        <MessagesChannel msg={a.msg} idme={a.idme} idCourant={chatName.id} />
      )}
      {cha_mp === "message private" && (
        <MessagesMp
          key="mp"
          msgMp={a.msgMp}
          idme={a.idme}
          idCourant={chatName.id}
        />
      )}
    </div>
  );
};

export default Messages;
