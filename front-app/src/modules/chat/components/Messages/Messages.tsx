import { useChannelContext } from "modules/chat/context/ChannelContext";
import React from "react";
import { useModeChannelMpContext } from "modules/chat/context/ModeChannelMpContext";
import { MessagesMp } from "./MessagesMp";
import { MessagesChannel } from "./MessagesChannel";

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
  key: string;
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
        <MessagesChannel
          key="channel"
          msg={a.msg}
          idme={a.idme}
          idCourant={chatName.id}
        />
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
