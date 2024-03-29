import React, { useState, useRef, useEffect } from "react";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useSocketContext } from "modules/common/context/SocketContext";
import { useChannelContext } from "modules/chat/context/ChannelContext";
import { useModeChannelMpContext } from "modules/chat/context/ModeChannelMpContext";
import { IconMessage } from "modules/common/components/_icons/icons";
import { users, form, pass, ban, channel } from "modules/chat/types";

interface Props {
  id: number;
}

const InputMessage = (a: Props) => {
  const [data, setData] = useState<form>({
    idSend: 0,
    idReceive: 0,
    texte: "",
  });
  const { chatName, changeChatName } = useChannelContext();
  const { cha_mp, changeCha_mp } = useModeChannelMpContext();
  const socket = useSocketContext();

  useEffect(() => {
    setData({ idSend: data.idSend, idReceive: chatName.id, texte: "" });
  }, [chatName]);

  const sendMessage = async () => {
    if (cha_mp === "channel") {
      await setData({
        idSend: data.idSend,
        idReceive: chatName.id,
        texte: data.texte,
      });
      await socket.emit("channelToServer", data);

      setData({ idSend: data.idSend, idReceive: chatName.id, texte: "" });
    } else if (cha_mp === "message private") {
      sendPrivate();
      setData({ idSend: data.idSend, idReceive: chatName.id, texte: "" });
    }
  };

  const sendPrivate = async () => {
    await socket.emit("message mp", data);
  };

  return (
    <div className="flex flex-row  h-8 mb-10">
      <input
        className="rounded-lg flex w-full"
        type="text"
        value={data.texte}
        onChange={(e) => {
          setData({
            idSend: a.id,
            idReceive: chatName.id,
            texte: e.target.value,
          });
        }}
        placeholder="Enter Character Name"
        onKeyPress={(event) => {
          event.key === "Enter" && sendMessage();
        }}
      ></input>
      <Button
        className="ml-4 text-center items-center  align-middle"
        variant="contained"
        color="active"
        icon={<IconMessage />}
        onClick={() => sendMessage()}
      >
        envoie
      </Button>
    </div>
  );
};

export default InputMessage;
