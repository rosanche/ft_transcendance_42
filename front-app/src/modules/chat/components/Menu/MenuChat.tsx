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
      <div className="flex flex-row text-center justify-between">
        <Button
          className="text-lg"
          variant="link"
          color="active"
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
          }}
          disabled={cha_mp === "channel" }
        >
          Channels
        </Button>
        <Button
          className=" text-lg"
          variant="link"
          color="active"
          onClick={() => {
            changeCha_mp("message private");
            setCreate(false);
          }}
          disabled={cha_mp !== "channel" }
        >
          Messages Privés
        </Button>
      </div>
      <div className="text-white flex flex-1 justify-center align-center m-4">
        {cha_mp === "channel" ? (
          <Button
            className="text-center"
            variant="contained"
            color="active"
            onClick={() => {
              setCreate(!create);
            }}
          >
            Nouveau channel
          </Button>
        ) : (
          <Button
            className="text-center "
            variant="contained"
            color="active"
            onClick={showModal}
          >
            Nouveau message
          </Button>
        )}
      </div>
      <div>
        {!create && (
          <div className="m-4">
            {cha_mp == "message private" && (
              <MenuMessagesMp users={a.users} msgMp={a.msgMp} />
            )}
            {cha_mp == "channel" && (
              <MenuMessagesChannel channels={a.channel} />
            )}
          </div>
        )}
        {create && <div className="m-4">{cha_mp == "channel" && <ChannelCreate />}</div>}
      </div>
    </div>
  );
};
