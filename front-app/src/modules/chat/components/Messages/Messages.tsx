import { useChannelContext } from "modules/chat/context/ChannelContext";
import React, { useEffect, useState } from "react";
import { useModeChannelMpContext } from "modules/chat/context/ModeChannelMpContext";
import { MessagesMp } from "./MessagesMp";
import { MessagesChannel } from "./MessagesChannel";
import { users, form, pass, ban, channel } from "modules/chat/types";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { useSocketContext } from "modules/common/context/SocketContext";

interface Props {
  msg: form[];
  msgMp: form[];
  idme: number;
}

const Messages = (a: Props) => {
  const { chatName, changeChatName } = useChannelContext();
  const { cha_mp, changeCha_mp } = useModeChannelMpContext();
  const socket = useSocketContext();
  const [blocked, SetBlocked] = useState<number[]>([]);

  useEffect(() => {
    socket.emit("me blocks");
    socket.on("use info block", (c: number[]) => {
      SetBlocked(c);
      console.log("toi et moi", c);
    });
  }, [socket]);

  return (
    <div>
      {cha_mp === "channel" && (
        <MessagesChannel msg={a.msg} idme={a.idme} idCourant={chatName.id} />
      )}
      {cha_mp === "message private" &&
        blocked.find((el) => el === chatName.id) === undefined && (
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
