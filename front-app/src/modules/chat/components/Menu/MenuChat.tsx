import React, { useState, useRef, useEffect } from "react";
import { MenuMessagesChannel } from "modules/chat/components/Menu/MenuMessageChannel";
import { MenuMessagesMp } from "modules/chat/components/Menu/MenuMessageMp";
import { useSocketContext } from "modules/common/context/SocketContext";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useChannelContext } from "modules/chat/context/ChannelContext";
import { useModeChannelMpContext } from "modules/chat/context/ModeChannelMpContext";
import { ChannelCreate } from "../Channel/ChannelCreate";

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
  users: user[];
  msgMp: form[];
  channel: Channel[];
}

export const MenuChat = (a: Props) => {
  const { cha_mp, changeCha_mp } = useModeChannelMpContext();
  const socket = useSocketContext();
  const [create, setCreate] = useState<boolean>(false);
  return (
    <div>
      <span className="text-white font-medium text-2xl text-center leading-[3rem]">
        {cha_mp}{" "}
        <Button
          className="ml-1 text-lg"
          variant="link"
          disabled={false}
          color=""
          onClick={() => {
            setCreate(!create);
          }}
        >
          {cha_mp === "channel" && <span>create Channel</span>}
          {cha_mp === "message private" && <span>search user</span>}
        </Button>
      </span>
      <div>
        <span className=" flex-initial justify-center">
          <Button
            className="ml-1 text-lg"
            variant="link"
            disabled={false}
            color=""
            onClick={() => {
              changeCha_mp("channel");
              setCreate(false);
            }}
          >
            channel
          </Button>
          <Button
            className="ml-2 text-lg"
            variant="link"
            disabled={false}
            onClick={() => {
              changeCha_mp("message private");
              setCreate(false);
            }}
          >
            message private
          </Button>
        </span>
        {!create && (
          <div>
            {cha_mp == "message private" && (
              <MenuMessagesMp key="mp" users={a.users} msgMp={a.msgMp} />
            )}
            {cha_mp == "channel" && (
              <MenuMessagesChannel key="channel" channels={a.channel} />
            )}
          </div>
        )}
        {create && (
          <div>
            {cha_mp == "channel" && <ChannelCreate />}
            {cha_mp == "message private" && <span>pour l'instant rien</span>}
          </div>
        )}
      </div>
    </div>
  );
};
