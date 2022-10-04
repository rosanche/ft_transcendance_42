import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "modules/common/components/_ui/Button/Button";
import socketio from "socket.io-client";
import { useRouter } from "next/router";
import { useSocketContext } from "modules/common/context/SocketContext";
import { UserMp } from "modules/chat/components/Menu/Messagemp";

import { MessagesChannel } from "modules/chat/components/Messages/MessagesChannel";

import { MessagesMp } from "modules/chat/components/Messages/MessagesMp";
import { Channel } from "modules/chat/components/Channel/Channel";
import { Page } from "modules/common/components/_ui/Page/Page";
import { IconMessage } from "modules/common/components/_icons/icons";
import Image from "next/image";
import {
  IconAddFriend,
  IconBlock,
} from "modules/common/components/_icons/icons";
import { useChannelContext } from "modules/chat/context/ChannelContext";
import { MenuMessagesChannel } from "modules/chat/components/Menu/MenuMessageChannel";
import { MenuMessagesMp } from "modules/chat/components/Menu/MenuMessageMp";
import { TitreChannel } from "modules/chat/components/Titre/TitreChannel";

type form = {
  idSend: number;
  idReceive: number;
  texte: string;
};

type pass = {
  idChannel: number;
  name: string;
  password: string;
  private: boolean;
};

type channel = {
  id: number;
  name: string;
  private: boolean;
  user: boolean;
  admin: boolean;
  owner: boolean;
  password: boolean;
};

type ban = {
  mute_ban: string;
  idChannel: number;
  idUser: number;
  time: number;
  motif: string;
};

type users = {
  id: number;
  pseudo: string;
  stastu: number;
  blocked: boolean;
  myblocked: boolean;
};

const Chat = () => {
  const socket = useSocketContext();
  const [channel, setChannel] = useState<users[]>([]);
  const [invite, setInvite] = useState<boolean>(false);
  const [newAdmin, setNewAdmin] = useState<boolean>(false);
  const [newOwner, setNewOwner] = useState<boolean>(false);
  const [create, setCreate] = useState<boolean>(false);
  const [me, setMe] = useState<users>({
    id: 0,
    pseudo: "",
    stastu: 0,
    blocked: false,
    myblocked: false,
  });
  //const [myMp, setMyMp] = useState<channel[]>([]);
  const [msg, setMsg] = useState<form[]>([]);
  const [msgMp, setMsgMp] = useState<form[]>([]);
  const [users, setUsers] = useState<users[]>([]);
  const [cha_mp, setCha_mp] = useState<string>("default");
  const [game, setGame] = useState<number>(0);
  const [frienMode, setFriendMode] = useState<number>(1);
  const [ban, setBan] = useState<ban>({
    mute_ban: "",
    idChannel: 0,
    idUser: 0,
    time: 0,
    motif: "",
  });
  const [passj, setPassj] = useState<pass>({
    idChannel: 0,
    name: "",
    password: "",
    private: false,
  });

  const { chatName, changeChatName } = useChannelContext();

  const [data, setData] = useState<form>({
    idSend: 0,
    idReceive: 0,
    texte: "",
  });

  const [isConnected, setIsConnected] = useState(socket.connected);
  const router = useRouter();

  /*  const [join, setJoin] = useState<channel>({
    id: 0,
    name: "",
    private: false,
    admin: false,
    owner: false,
    password: false,
  });*/

  const inviteChan = async (p: ban) => {
    console.log(p);
    socket.emit("invite channel", p);
  };

  const accept_invite = async () => {
    router.push("http://localhost:3001/game?INVITE=" + game);
  };

  const joinPass = async (passj: pass) => {
    await socket.emit("joins channel password", passj);
    await setPassj({ name: "", password: "", private: false });
    /* await setJoin({
      id: 0,
      name: "",
      private: false,
      admin: false,
      owner: false,
      password: false,
    });*/
  };

  const demfriend = async (el: users) => {
    console.log(el);
    await socket.emit("dem friend", el.id);
  };

  const acceptfriend = async (el: users) => {
    console.log(el);
    await socket.emit("accept friend", el.id);
  };

  const supdemfirend = async (el: users) => {
    console.log(el);
    await socket.emit("sup dem friend", el.id);
  };

  const supfriend = async (el: users) => {
    console.log(el);
    await socket.emit("sup friend", el.id);
  };

  const refusefriend = async (el: users) => {
    console.log(el);
    await socket.emit("refuse friend", el.id);
  };

  const changeChaMp = async (val: string) => {
    changeChatName({
      id: 0,
      name: "",
      private: false,
      admin: false,
      password: false,
    });
    setData({ pseudo: data.pseudo, channel: "", texte: "" });
    setCha_mp(val);
  };

  const quit = async () => {
    console.log();
    await socket.emit("quit", chatName.id);
    const u = await channel.filter((el) => channel.name !== el.name);
    console.log(u);
    await setChannel(u);

    console.log(channel);
    await changeChatName({
      id: 0,
      name: "",
      private: false,
      admin: false,
      password: false,
    });
    await console.log(chatName);
    const a: channel = await channel.at(0);
    console.log(a.name);
    await setData({ pseudo: data.pseudo, channel: a.name, texte: "" });
  };
  const changefriendmode = async (i: number) => {
    changeChatName({
      id: 0,
      name: "",
      private: false,
      admin: false,
      password: false,
    });
    setData({ pseudo: data.pseudo, channel: "", texte: "" });
    setFriendMode(i);
  };
  const addAdmin = async (cha: ban) => {
    console.log(cha);
    socket.emit("new admin", cha);
  };

  const changeOwner = async (cha: ban) => {
    console.log(cha);
    socket.emit("change owner", cha);
  };

  const creatCha = async (cha: pass) => {
    console.log(cha);
    socket.emit("creatcha", cha);
    setPassj({ name: "", password: "", private: false });
  };

  const Ban = async () => {
    await socket.emit("blockedChannel", ban);
    console.log(`a ouai c'est toi ${ban.idChannel}`);
    await socket.emit("list user channel", ban.idChannel);
    //const u =  await channel.filter(el => v.name !== el.name);
    await console.log(ban);
    await console.log(chatName);
  };

  const test = async () => {
    console.log("A");
  };

  const sendMessage = async () => {
    if (cha_mp === "channel") {
      console.log("ouiiiiiiiii");

      console.log("UN JOUR PEUT ETRE");
      await setData({
        idSend: data.idSend,
        idReceive: chatName.id,
        texte: data.texte,
      });
      await socket.emit("channelToServer", data);

      setData({ idSend: data.idSend, idReceive: chatName.id, texte: "" });
    } else if (cha_mp === "message private") {
      sendPrivate();
    }
  };

  const sendPrivate = async () => {
    console.log(data);
    await socket.emit("message mp", data);
  };

  const changechannel = async (el: channel) => {
    console.log(el);
    await setData({ idSend: me.id, idReceive: el.id, texte: "" });
    console.log(data);
    await changeChatName(el);
  };

  const joinchannel = async (el: channel) => {
    console.log(el);
    if (el.password === false) {
      await socket.emit("joins channel", el.id);
      console.log(el);
    } else {
      setPassj({
        idChannel: el.id,
        name: el.name,
        password: "",
        private: el.private,
      });
    }
  };

  const demParti = (el: form) => {
    console.log(el);
    router.push(
      "http://localhost:3001/game?CREATE=" + el.idSend + "&BONUS=FALSE"
    );
  };

  const BlockedUser = (el: form) => {
    //console.log(el)

    socket.emit("blockedUser", el);
  };

  const log = (ms: form) => {
    console.log(ms);
    console.log("success");
    setMsg((m) => [...m, ms]);
  };
  useEffect(() => {
    /*
    socket.on("mp list", (c: channel[]) => {
      console.log("oui 5");
      console.log(c);
     // setMyMp(c);
    });
*/

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

    socket.on("message join channel", (c: form[]) => {
      console.log(c);
      console.log("oui");
      const newArrayForm = [...msg, ...c];
      console.log(newArrayForm);
      setMsg(newArrayForm);
    });

    socket.on("new channel pub", (c: channel) => {
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

    socket.on("join channel true", (ret: channel) => {
      console.log("enfin une nouvellle fiture");
      setChannel((channels) => [...channels, ret]);
      changechannel(ret);
      //modifpub(ret)
      //
    });

    socket.on("channels list", (channels: channel[]) => {
      console.log("channels list");
      console.log(channels);
      setChannel(channels);
    });
    ("join channel false password");

    socket.on("join channel false password", (channels: channel[]) => {
      //socket.off("join channel false password");
    });

    socket.on("info channel", (mm: form[]) => {
      //socket.off('info channel');
      console.log(mm);

      console.log("oui 1000");
      setMsg(mm);
    });
    socket.on("info mp", (mm: form[]) => {
      //socket.off('info channel');
      console.log(mm);
      console.log("oui 1000");
      setMsgMp(mm);
    });
    socket.on("New Invitation Game", (id: Number) => {
      console.log(id);
      setGame(id);
    });
    socket.on("left chanel", async (room: channel) => {});

    socket.on("connect", () => {
      setIsConnected(true);
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
      socket.off("chatToClientMp");
    };
  }, []);

  useEffect(() => {
    console.log("oui!!!!!!!!!!!!!!!!!!!!!!!!!");
    if (typeof document != "undefined") {
      console.log("ouissssss");
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token"))
        ?.split("=")[1];
      socket.connect();
      // console.log(cookieValue);Message
      socket.auth.token = cookieValue;
      //   console.log(router.query)
      socket.connect();
      socket.emit("channelinit");
      socket.emit("listchannels");
      socket.emit("me info");
      socket.emit("me blocks");
      socket.emit("list users");
      socket.emit("list mps");
    }

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Page title="chat" width=" w-2/3">
      <div className="flex flex-1 flex-row h-5/6 scroll-smooth max-h-scren ">
        <RoundedContainer className="flex-none w-1/3  mu-3 items-start mb-9">
          <span className="text-white font-medium text-2xl text-center leading-[3rem]">
            {cha_mp}
          </span>
          <span className=" flex-initial justify-center">
            <Button
              className="ml-1 text-lg"
              variant="link"
              disabled={false}
              color=""
              onClick={() => changeChaMp("channel")}
            >
              channel
            </Button>
            <Button
              className="ml-2 text-lg"
              variant="link"
              disabled={false}
              onClick={() => changeChaMp("message private")}
            >
              message private
            </Button>
          </span>
          {cha_mp == "message private" && (
            <MenuMessagesMp users={users} msgMp={msgMp} />
          )}
          {cha_mp == "channel" && <MenuMessagesChannel channels={channel} />}
        </RoundedContainer>
        <div className="flex flex-1 flex-col ml-8 w-2/3 justify-between ">
          <TitreChannel />
          <RoundedContainer className="flex overflow-auto overscroll-contain h-3/4  mu-3  mb-9">
            {cha_mp === "channel" && (
              <MessagesChannel
                key="channel"
                msg={msg}
                idme={me.id}
                idCourant={chatName.id}
              />
            )}
            {
              cha_mp === "message private" && (
                <MessagesMp
                  key="mp"
                  msgMp={msgMp}
                  idme={me.id}
                  idCourant={chatName.id}
                />
              )
              /*
            cha_mp === "message private" &&
            msgMp
              .filter((e) => e.idReceive == chatName.id)
              .map((el, i) => (
                <div className="m-1.5">
                  {el.idSend != me.id && (
                    <div className="flex justify-start">
                      <OtherMessage key={i} message={el} />
                    </div>
                  )}
                  {el.idSend == me.id && (
                    <div className="flex justify-end">
                      <MyMessage key={i} message={el} />
                    </div>
                  )*
                </div>
                  ))*/
            }
          </RoundedContainer>
          <div className="flex flex-row  h-8 mb-10">
            <input
              className="rounded-lg flex w-full"
              type="text"
              value={data.texte}
              onChange={(e) => {
                setData({
                  idSend: me.id,
                  idReceive: chatName.id,
                  texte: e.target.value,
                });
                console.log(data);
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
