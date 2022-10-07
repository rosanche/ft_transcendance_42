import React, { useState, useRef, useEffect } from "react";
import { MenuMessagesChannel } from "modules/chat/components/Menu/MenuMessageChannel";
import { MenuMessagesMp } from "modules/chat/components/Menu/MenuMessageMp";
import { useSocketContext } from "modules/common/context/SocketContext";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useChannelContext } from "modules/chat/context/ChannelContext";
import { useModeChannelMpContext } from "modules/chat/context/ModeChannelMpContext";
import { ChannelCreate } from "../Channel/ChannelCreate";
import { usersChannel, form, pass, ban, Channel } from "modules/chat/types";
import { useAddFriendModal } from "modules/profile/components/useAddFriendModal/useAddFriendModal";

interface Props {
  key: string;
  users: usersChannel[];
  msgMp: form[];
  channel: Channel[];
}

export const MenuChat = (a: Props) => {
  const { cha_mp, changeCha_mp } = useModeChannelMpContext();
  const { chatName, changeChatName } = useChannelContext();
  const [create, setCreate] = useState<boolean>(false);
  const { showModal } = useAddFriendModal({
    isInChannel: false,
    // idsToAvoid: [],
    // channelId: chatName?.id,
  });
  const socket = useSocketContext();

  useEffect(() => {
    socket.on("creat new channel success", (cha: Channel) => {
      changeChatName(cha);
      setCreate(false);
    });
  }, [socket]);
  return (
    <div className="flex flex-col">
      <div className=" flex rounded bg-black flex-row text-center justify-between">
        <Button
          className=" text-lg"
          variant="contained"
          disabled={false}
          color={cha_mp !== "channel" ? "active" : ""}
          onClick={() => {
            changeCha_mp("channel");
            changeChatName({
              id: 0,
              name: null,
              private: false,
              user: false,
              admin: false,
              owner: false,
              password: false,
            });
            setCreate(false);
            console.log(chatName);
          }}
        >
          Channels
        </Button>
        <Button
          className=" text-lg"
          variant="contained"
          color={cha_mp === "channel" ? "active" : ""}
          disabled={false}
          onClick={() => {
            changeCha_mp("message private");
            setCreate(false);
          }}
        >
          Messages Privés
        </Button>
      </div>
      <div className="text-white flex flex-row justify-between align-middle font-medium text-2xl text-center leading-[3rem]">
        <span>{cha_mp === "channel" ? "Channels" : "Messages Privés"}</span>
        {cha_mp === "channel" ? (
          <Button
            className="text-center"
            variant="contained"
            color=""
            onClick={() => {
              setCreate(!create);
            }}
          >
            Créer une channel
          </Button>
        ) : (
          <Button
            className="text-center "
            variant="contained"
            color=""
            onClick={showModal}
          >
            Users
          </Button>
        )}
      </div>
      <div>
        {!create && (
          <div>
            {cha_mp == "message private" && (
              <MenuMessagesMp key="DDD" users={a.users} msgMp={a.msgMp} />
            )}
            {cha_mp == "channel" && (
              <MenuMessagesChannel key="SSS" channels={a.channel} />
            )}
          </div>
        )}
        {create && <div>{cha_mp == "channel" && <ChannelCreate />}</div>}
      </div>
    </div>
  );
};
