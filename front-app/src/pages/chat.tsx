import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useSocketContext } from "modules/common/context/SocketContext";
import { Page } from "modules/common/components/_ui/Page/Page";
import { useChannelContext } from "modules/chat/context/ChannelContext";
import { TitreChannel } from "modules/chat/components/Titre/TitreChannel";
import { MenuChat } from "modules/chat/components/Menu/MenuChat";
import Messages from "modules/chat/components/Messages/Messages";
import { useModeChannelMpContext } from "modules/chat/context/ModeChannelMpContext";
import InputMessage from "modules/chat/components/InputMessage/InputMessage";
import { usersChannel, form, pass, ban, Channel } from "modules/chat/types";

const Chat = () => {
  const { chatName, changeChatName, changeChatNameleft } = useChannelContext();
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
    console.log(p);
    socket.emit("invite channel", p);
  };

  const accept_invite = async () => {
    router.push("http://localhost:3001/game?INVITE=" + game);
  };

  const Ban = async () => {
    await socket.emit("blockedChannel", ban);
    console.log(`a ouai c'est toi ${ban.idChannel}`);
    await socket.emit("list user channel", ban.idChannel);
    //const u =  await channel.filter(el => v.name !== el.name);
    await console.log(ban);
    await console.log(chatName);
  };

  const demParti = (el: form) => {
    console.log(el);
    router.push(
      "http://localhost:3001/game?CREATE=" + el.idSend + "&BONUS=FALSE"
    );
  };

  useEffect(() => {
    socket.on("cha users", (c: number[]) => {
      //  setChannel((u)=> [...u,c]);
      console.log("oui 3");
      //setUsers(c);
      console.log(c);
    });

    socket.on("user list", (c: users[]) => {
      //  setChannel((u)=> [...u,c]);
      console.log("oui 3");
      setUsers(c);
      console.log(c);
    });

    socket.on("use info block", (c: string[]) => {
      //  setChannel((u)=> [...u,c]);
      console.log("oui 2");
    });

    socket.on("use info", (c: users) => {
      //  setChannel((u)=> [...u,c]);
      console.log("nija");
      console.log(c);
      setMe(c);
    });
    const test = async () => {
      console.log("A");
    };
    /*
    socket.on("owner no left", (c: channel) => {
      //  setChannel((u)=> [...u,c]);
      changeChatName(c);
      setNewOwner(true);
    });

    socket.on("my new channel pub", (c: channel) => {
      setChannel((u) => [...u, c]);
      changeChatName(c);
      setCreate(false);
      console.log(c);
      setData({ channel: c.name, pseudo: data.pseudo, texte: "" });
    });
*/
    socket.on("message join channel", (c: form[]) => {
      console.log(c);
      console.log("oui");
      const newArrayForm = [...msg, ...c];
      console.log(newArrayForm);
      setMsg(newArrayForm);
    });

    socket.on("new channel pub", (c: Channel) => {
      socket.emit("listchannels");
      //setChannel((a) => [...a, c]);
    });
    socket.on("you ban_mute", (ret: ban) => {
      socket.off("you ban_mute");
      if (ret.mute_ban === "ban") {
      } else {
        console.log("AAAAls");
      }
      console.log("AAAAls");
    });

    socket.on("join channel true", (ret: Channel) => {
      console.log("enfin une nouvellle fiture");
      //setChannel((channels) => [...channels, ret]);
      changeChatName(ret);
      //changechannel(ret);
      //modifpub(ret)
      //
    });

    socket.on("channels list", (channels: Channel[]) => {
      console.log("channels list");
      console.log(channels);
      setChannel(channels);
    });
    ("join channel false password");

    socket.on("join channel false password", (channels: Channel[]) => {
      //socket.off("join channel false password");
    });

    socket.on("info channel", (mm: form[]) => {
      console.log(mm);
      console.log("oui 1000");
      setMsg(mm);
    });
    socket.on("info mp", (mm: form[]) => {
      console.log(mm);
      console.log("oui 1000");
      setMsgMp(mm);
    });
    socket.on("New Invitation Game", (id: Number) => {
      console.log(id);
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
      console.log("oui");
      console.log(`toi et moi ${you}`);
    });

    socket.on("user info", (user: { id: number; pseudo: string }) => {
      console.log(user);
      setData({ channel: "", pseudo: user.pseudo, texte: "" });
    });

    socket.on("auth error", () => {
      router.replace("/connexion");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("chatToClient", (src: form) => {
      console.log("AAAAAAAAAAAAAAAAa");
      log(src);
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
    console.log("oui!!!!!!!!!!!!!!!!!!!!!!!!!");
    //   if (typeof document != "undefined") {
    console.log("ouissssss");
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token"))
      ?.split("=")[1];
    // console.log(cookieValue);Message
    socket.auth.token = cookieValue;
    //   console.log(router.query)
    socket.connect();
    console.log(isConnected);
    socket.emit("channelinit");
    socket.emit("listchannels");
    socket.emit("me info");
    socket.emit("me blocks");
    socket.emit("list users");
    socket.emit("list mps");
    socket.emit("list user channel");

    console.log("finish !!!!!!!!!!!!!!!!!!!!!!!!!");
    //}

    /*return () => {
      socket.disconnect();
    };*/
  }, [isConnected]);

  return (
    <Page title="chat" width=" w-2/3">
      <div className="flex flex-1 flex-row h-5/6 scroll-smooth max-h-scren ">
        <RoundedContainer className="flex-none w-1/3  mu-3 items-start mb-9">
          <MenuChat key="ss" users={users} msgMp={msgMp} channel={channel} />
        </RoundedContainer>
        <div className="flex flex-1 flex-col ml-8 w-2/3 justify-between ">
          <TitreChannel usersChannelId={usersChannel_} />
          <RoundedContainer className="flex overflow-auto overscroll-contain h-3/4  mu-3  mb-9">
            <Messages key="SS" msg={msg} msgMp={msgMp} idme={me.id} />
          </RoundedContainer>
          <InputMessage id={me.id} />
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
            {true && (
              <div>
                {msg
                  .filter(
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
