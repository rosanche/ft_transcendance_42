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
  const { showModal: showAddUserModal } = useAddFriendModal({
    isInChannel: false,
    idsToAvoid: [],
    channelId: chatName.id,
  });
  return (
    <div>
<<<<<<< HEAD
      <span className="text-white justify-between font-medium text-2xl text-center leading-[3rem]">
        {cha_mp}{" "}
=======
      <span className="text-white font-medium text-2xl text-center leading-[3rem]">
>>>>>>> refs/remotes/origin/main
        <Button
          className="ml-1 text-lg"
          variant="link"
          disabled={false}
          color=""
          onClick={() => {
            !create && { showAddUserModal };
            cha_mp === "message private";
            setCreate(!create);
          }}
        >
          {cha_mp === "channel" && <span>create Channel</span>}
          {cha_mp === "message private" && <span>search user</span>}
        </Button>
      </span>
      <div>
        <div className=" flex flex-row text-center justify-between">
          <Button
            className=" text-lg"
            variant="link"
            disabled={false}
            color=""
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
            channel
          </Button>
          <Button
            className=" text-lg"
            variant="link"
            disabled={false}
            onClick={() => {
              changeCha_mp("message private");
              setCreate(false);
            }}
          >
            message private
          </Button>
        </div>
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
