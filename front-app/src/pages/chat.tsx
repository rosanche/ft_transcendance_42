import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSocketContext } from "modules/common/context/SocketContext";
import { Page } from "modules/common/components/_ui/Page/Page";
import { useChannelContext } from "modules/chat/context/ChannelContext";
import { TitreChannel } from "modules/chat/components/Titre/TitreChannel";
import { MenuChat } from "modules/chat/components/Menu/MenuChat";
import Messages from "modules/chat/components/Messages/Messages";
import { useModeChannelMpContext } from "modules/chat/context/ModeChannelMpContext";
import InputMessage from "modules/chat/components/InputMessage/InputMessage";
import { usersChannel, form, Channel } from "modules/chat/types";

const Chat = () => {
  const { chatName, changeChatName } = useChannelContext();
  const socket = useSocketContext();
  const { changeCha_mp } = useModeChannelMpContext();
  const [channel, setChannel] = useState<Channel[]>([]);
  const [me, setMe] = useState<usersChannel>({
    id: 0,
    pseudo: "",
    stastu: 0,
    blocked: false,
    myblocked: false,
  });
  const [usersChannel_, setUsersChannel_] = useState<number[]>([]);
  const [msg, setMsg] = useState<form[]>([]);
  const [msgMp, setMsgMp] = useState<form[]>([]);
  const [users, setUsers] = useState<usersChannel[]>([]);
  const [game, setGame] = useState<Number>(0);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const router = useRouter();

  useEffect(() => {
    changeCha_mp("message private");
    changeChatName({
      id: parseInt(router.query.userId),
      name: router.query.pseudo,
      private: false,
      user: false,
      admin: false,
      owner: false,
      password: "",
    });
  }, [router.query]);

  const inviteChan = async (p: ban) => {
    socket.emit("invite channel", p);
  };

  const accept_invite = async () => {
    router.push("http://localhost:3001/game?INVITE=" + game);
  };

  const Ban = async () => {
    await socket.emit("blockedChannel", ban);

    await socket.emit("list user channel", ban.idChannel);
    //const u =  await channel.filter(el => v.name !== el.name);
  };

  const demParti = (el: form) => {
    router.push(
      "http://localhost:3001/game?CREATE=" + el.idSend + "&BONUS=FALSE"
    );
  };

  useEffect(() => {
    socket.on("cha users", (c: number[]) => {});

    socket.on("user list", (c: users[]) => {
      setUsers(c);
    });

    socket.on("use info", (c: users) => {
      setMe(c);
    });
    const test = async () => {};

    socket.on("message join channel", (c: form[]) => {
      const newArrayForm = [...msg, ...c];

      setMsg(newArrayForm);
    });

    socket.on("new channel pub", (c: Channel) => {
      socket.emit("listchannels");
    });

    socket.on("join channel true", (ret: Channel) => {
      changeChatName(ret);
    });

    socket.on("channels list", (channels: Channel[]) => {
      setChannel(channels);
    });
    ("join channel false password");

    socket.on("join channel false password", (channels: Channel[]) => {
      //socket.off("join channel false password");
    });

    socket.on("info channel", (mm: form[]) => {
      setMsg(mm);
    });

    socket.on("action channel", (cha: Channel) => {
      if (cha && cha.id == chatName.id && cha_mp === "channel")
        changeChatName(cha);
    });

    socket.on("info mp", (mm: form[]) => {
      setMsgMp(mm);
    });
    socket.on("New Invitation Game", (id: Number) => {
      setGame(id);
    });

    socket.on("left chanel", async (id: number) => {
      changeChatName({
        id: chatName.id,
        name: chatName.name,
        private: chatName.private,
        user: false,
        admin: false,
        owner: false,
        password: chatName.password,
      });
    });

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("cha users", (you: number[]) => {
      setUsersChannel_(you);
    });

    socket.on("auth error", () => {
      router.replace("/connexion");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("chatToClient", (src: form) => {
      setMsg((m) => [...m, src]);
    });

    socket.on("chatToClientMp", (src: form) => {
      setMsgMp((m) => [...m, src]);
    });

    //   socket.on('user', (user : {name: string, id: }))

    return () => {
      socket.off("my new channel pub");
      socket.off("channels list");
      socket.off("info channel");
      socket.off("channels pub");
      socket.off("disconnect");
      socket.off("chatToClient");
      socket.off("left chanel");
      socket.off("join channel true");
      socket.off("new channel pub");
      socket.off("list user channel", 1);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token"))
      ?.split("=")[1];
    socket.auth.token = cookieValue;

    if (socket.connected) {
      socket.emit("channelinit");
      socket.emit("listchannels");
      socket.emit("me info");
      socket.emit("me blocks");
      socket.emit("list users");
      socket.emit("list mps");
      socket.emit("list user channel");
    }
  }, [isConnected]);

  const { cha_mp } = useModeChannelMpContext();

  return (
    <Page title="Chat" width="w-2/3">
      <div className="flex flex-1 flex-row h-5/6 scroll-smooth max-h-scren ">
        <RoundedContainer className="flex-none w-1/3 p-8  mu-3 ">
          <MenuChat key="ss" users={users} msgMp={msgMp} channel={channel} />
        </RoundedContainer>
        <div className="flex flex-1 flex-col ml-8 w-2/3 justify-between ">
          <TitreChannel usersChannelId={usersChannel_} />
          <RoundedContainer className="flex overflow-auto overscroll-contain h-3/4  mu-3  mb-9">
            <Messages key="SS" msg={msg} msgMp={msgMp} idme={me.id} />
          </RoundedContainer>
          {chatName.id != 0 && chatName.name && <InputMessage id={me.id} />}
        </div>
      </div>
    </Page>
  );
  /*
  return (
    <Page titre="chat" className="W-full">
      <div className="flex flex-1 flex-row h-5/6">
        <RoundedContainer className="flex flex-1  mu-3 items-start mb-9">
          <span className="text-white">ddddddddddijdddd</span>
          {channel.map((el, i) => {
            <div>
              <Message idSend={1} idReceive={el.idChannel} texte={el.name} />
            </div>;
          })}
        </RoundedContainer>
        <div className="flex flex-1  flex-col justify-between w-full">
          <span className="text-white">Kelly</span>
          <div className="flex justify-end h-8   mr-5 mb-10">
            <input className="rounded-lg ml-5 " type="text"></input>
            {true && (mp.create
                    (el) =>
                      el.idReceive === data.idReceive &&
                      users.find((u) => u.myblocked) === undefined
                  )
                  .map((el, i) => (
                    <Message
                      idSend={el.idSend}
                      idReceive={el.idReceive}
                      texte={el.texte}
                    />
                  ))}
              </div>
            )}
            <Button
              className="ml-[0.5rem] w-[rem4.5]"
              variant="contained"
              color="active"
              onClick={() => {}}
            >
              envoie
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
                  */
};

export default Chat;
