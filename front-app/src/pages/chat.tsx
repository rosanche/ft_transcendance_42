import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "modules/common/components/_ui/Button/Button";
import socketio from "socket.io-client";
import { useRouter } from "next/router";
import { useSocketContext } from "modules/common/context/SocketContext";

type Form = {
  channel: string;
  pseudo: string;
  texte: String;
};

type pass = {
  name: string;
  password: string;
  private: boolean;
};

type channel = {
  id: number;
  name: string;
  private: boolean;
  admin: boolean;
  owner: boolean;
  password: boolean;
};

type ban = {
  mute_ban: string;
  name: string;
  pseudo: string;
  time: number;
  motif: string;
};

type users = {
  id: number;
  pseudo: string;
  stastu: number;
};

const Chat = () => {
  const socket = useSocketContext();
  console.log("$$socket", socket);
  const [DemFriend, setDemFriend] = useState<string[]>([]);
  const [myDemFriend, setMyDemFriend] = useState<string[]>([]);
  const [myFriend, setMyFriend] = useState<string[]>([]);
  const [myMp, setMyMp] = useState<channel[]>([]);
  const [mp, setMp] = useState<Form>([]);
  const [cha_mp, setCha_mp] = useState<number>(1);
  const [frienMode, setFriendMode] = useState<number>(1);
  const [users, setUsers] = useState<users[]>([]);
  const [useBlock, setUseBlock] = useState<string[]>([]);
  const [me, setMe] = useState<string>("");
  const [invite, setInvite] = useState<boolean>(false);
  const [newAdmin, setNewAdmin] = useState<boolean>(false);
  const [newOwner, setNewOwner] = useState<boolean>(false);
  const [create, setCreate] = useState<boolean>(false);
  const [ban, setBan] = useState<ban>({
    mute_ban: "",
    name: "",
    pseudo: "",
    time: 0,
    motif: "",
  });
  //  const [ads, setAds] =  useState<number>(0);
  const [passj, setPassj] = useState<pass>({
    name: "",
    password: "",
    private: false,
  });
  const [join, setJoin] = useState<channel>({
    id: 0,
    name: "",
    private: false,
    admin: false,
    owner: false,
    password: false,
  });
  const [data, setData] = useState<Form>({
    pseudo: "me",
    channel: "general",
    texte: "",
  });
  const [msg, setMsg] = useState<Form[]>([]);
  const [chatName, setChatName] = useState<channel>({
    id: 0,
    name: "",
    private: false,
    admin: false,
    password: false,
  });
  const [channel, setChannel] = useState<channel[]>([]);
  const [channelPub, setChannelPub] = useState<channel[]>([]);
  //const [pre, setPre] =  useState<Form>({pseudo : "", channel: "" ,text: ""});
  const [isConnected, setIsConnected] = useState(socket.connected);
  const router = useRouter();

  const inviteChan = async (p: ban) => {
    console.log(p);
    socket.emit("invite channel", p);
  };

  const joinPass = async (passj: pass) => {
    await socket.emit("joins channel password", passj);
    await setPassj({ name: "", password: "", private: false });
    await setJoin({
      id: 0,
      name: "",
      private: false,
      admin: false,
      owner: false,
      password: false,
    });
  };

  const demfriend = async (el: users) => {
    console.log(el);
    await socket.emit("dem friend", el);
  };

  const acceptfriend = async (el: users) => {
    console.log(el);
    await socket.emit("accept friend", el);
  };

  const supdemfirend = async (el: users) => {
    console.log(el);
    await socket.emit("sup dem friend", el);
  };

  const refusefriend = async (el: users) => {
    console.log(el);
    await socket.emit("refuse friend", el);
  };

  const changeChaMp = async (val: number) => {
    setChatName({
      id: 0,
      name: "",
      private: false,
      admin: false,
      password: false,
    });
    setData({ pseudo: data.pseudo, channel: "", texte: "" });
    setCha_mp(val);
    setMp("");
  };

  const quit = async (chat: channel) => {
    await socket.emit("quit", chat);

    const u = await channel.filter((el) => chat.name !== el.name);
    console.log(u);
    await setChannel(u);
    console.log(channel);
    await setChatName({
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
    setChannelPub([...channelPub, chat]);
  };
  const changefriendmode = async (i: number) => {
    setChatName({
      id: 0,
      name: "",
      private: false,
      admin: false,
      password: false,
    });
    setData({ pseudo: data.pseudo, channel: "", texte: "" });
    setFriendMode(i);
    setMp("");
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
    //const u =  await channel.filter(el => v.name !== el.name);
    await console.log("ASDFFSFSF");
  };
  const test = async () => {
    console.log("A");
  };
  /*const modifpub = async (ret : channel) => {
          const tmp = await channel.filter((e)=> ret.name !== e.name);
          setChannelPub(tmp);
    }*/

  const sendMessage = async () => {
    console.log("ouiiiiiiiii");

    console.log("UN JOUR PEUT ETRE");
    console.log(data);
    await socket.emit("channelToServer", data);

    setData({ channel: data.channel, pseudo: data.pseudo, texte: "" });
  };

  const sendPrivate = async () => {
    //console.log("ouiiiiiiiii")

    //console.log("UN JOUR PEUT ETRE")
    console.log(data);
    await socket.emit("message mp", data);

    //  setData({channel: data.channel, pseudo : data.pseudo ,texte: ""});
  };

  const changechannel = async (el: channel) => {
    console.log(el);
    setData({ channel: el.name, pseudo: data.pseudo, texte: "" });
    await setChatName(el);
    if (el.id === -1) setMp(el.name);
    //console.log(chatName)
  };

  const joinchannel = async (el: channel) => {
    console.log(el);
    if (el.password === false) {
      await socket.emit("joins channel", el.name);
      const a: channel[] = await channelPub.filter((b) => b.name !== el.name);
      setChannelPub(a);
    } else {
      setJoin(el);
    }
  };
  const demParti = (el: Form) => {
    console.log(el);
  };

  const BlockedUser = (el: Form) => {
    //console.log(el)

    socket.emit("blockedUser", el);
  };

  const log = (ms: Form) => {
    console.log(ms);
    console.log("success");
    setMsg((m) => [...m, ms]);
    //setChannel([...channel,  ms.text])

    //   setMsg([...msg, data]);
    //setData({channel: chatName, pseudo : data.pseudo ,texte: ""});
  };
  useEffect(() => {
    console.log("AAAAA");

    socket.on("mp list", (c: channel[]) => {
      console.log("oui 5");
      console.log(c);
      setMyMp(c);
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
      setUseBlock(c);
    });

    socket.on("use info", (c: string) => {
      //  setChannel((u)=> [...u,c]);
      setMe(c);
    });

    socket.on("owner no left", (c: channel) => {
      //  setChannel((u)=> [...u,c]);
      setChatName(c);
      setNewOwner(true);
    });
    socket.on("my new channel pub", (c: channel) => {
      setChannel((u) => [...u, c]);
      setChatName(c);
      setCreate(false);
    });

    socket.on("new channel pub", (c: channel) => {
      setChannelPub((a) => [...a, c]);
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
      socket.off("channels list");
      setChannel(channels);
    });
    ("join channel false password");

    socket.on("join channel false password", (channels: channel[]) => {
      socket.off("join channel false password");
    });

    socket.on("channels pub", (channels: channel[]) => {
      socket.off("channels pub");
      setChannelPub(channels);
    });

    socket.on("info channel", (mm: Form[]) => {
      //socket.off('info channel');
      console.log(mm);
      setMsg(mm);
    });

    socket.on("left chanel", async (room: channel) => {
      socket.off("left chanel");
    });

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

    socket.on("chatToClient", (src: Form) => {
      log(src);
    });

    //   socket.on('user', (user : {name: string, id: }))

    return () => {
      socket.off("my new channel pub");
      socket.off("channels list");
      socket.off("info channel");
      socket.off("channels pub");
      socket.off("connect");
      socket.off("user info");
      socket.off("auth error");
      socket.off("disconnect");
      socket.off("chatToClient");
      socket.off("left chanel");
      socket.off("join channel true");
      socket.off("new channel pub");
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
      // console.log(cookieValue);
      socket.auth.token = cookieValue;
      //   console.log(router.query)
      socket.connect();
      socket.emit("channelinit");
      socket.emit("listchannels");
      socket.emit("pubchannels");
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
    <RoundedContainer className="px-14 py-20 mt-16 bg-indigo-200">
      <span>
        <Button
          className="mb-10  px-2 py-1"
          variant="contained"
          color="active"
          onClick={() => {
            changeChaMp(1);
          }}
        >
          channel
        </Button>
        <Button
          className="mb-10  px-2 py-1"
          variant="contained"
          color="active"
          onClick={() => {
            changeChaMp(2);
          }}
        >
          message private
        </Button>
        <Button
          className="mb-10  px-2 py-1"
          variant="contained"
          color="active"
          onClick={() => {
            changeChaMp(3);
          }}
        >
          friend
        </Button>
      </span>
      <div>
        {cha_mp == 1 && (
          <div>
            <h1>{chatName.name}</h1>
            <Button
              className="mb-10  px-2 py-1"
              variant="contained"
              color="active"
              onClick={() => setCreate(!create)}
            >
              create
            </Button>
            {!create && (
              <div>
                {chatName.name != "" && (
                  <Button
                    className="mb-10  px-2 py-1"
                    variant="contained"
                    color="active"
                    onClick={() => quit(chatName)}
                  >
                    quit
                  </Button>
                )}
                {newOwner && (
                  <h3>
                    new owner :
                    <input
                      className=" px-2 py-1"
                      type="text"
                      value={ban.pseudo}
                      onChange={(e) => {
                        setBan({
                          mute_ban: "",
                          name: chatName.name,
                          pseudo: e.target.value,
                          time: ban.time,
                          motif: "",
                        });
                      }}
                      placeholder="Enter new owner"
                      name="chat"
                    />
                    {ban.pseudo !== "" && (
                      <Button
                        className="mb-10  px-2 py-1"
                        variant="contained"
                        color="active"
                        onClick={() => changeOwner(ban)}
                      >
                        envoie
                      </Button>
                    )}
                  </h3>
                )}

                {chatName.admin && (
                  <div>
                    {chatName.owner && (
                      <Button
                        className="mb-10  px-2 py-1"
                        variant="contained"
                        color="active"
                        onClick={() => setNewAdmin(!newAdmin)}
                      >
                        add admin
                      </Button>
                    )}
                    {newAdmin && (
                      <h3>
                        new admin :
                        <input
                          className=" px-2 py-1"
                          type="text"
                          value={ban.pseudo}
                          onChange={(e) => {
                            setBan({
                              mute_ban: "",
                              name: chatName.name,
                              pseudo: e.target.value,
                              time: ban.time,
                              motif: "",
                            });
                          }}
                          placeholder="Enter new owner"
                          name="chat"
                        />
                        {ban.pseudo !== "" && (
                          <Button
                            className="mb-10  px-2 py-1"
                            variant="contained"
                            color="active"
                            onClick={() => addAdmin(ban)}
                          >
                            envoie
                          </Button>
                        )}
                      </h3>
                    )}
                    <Button
                      className="mb-10  px-2 py-1"
                      variant="contained"
                      color="active"
                      onClick={() => log(data)}
                    >
                      blocked
                    </Button>
                    <Button
                      className="mb-10  px-2 py-1"
                      variant="contained"
                      color="active"
                      onClick={() =>
                        setBan({
                          mute_ban: "mute",
                          name: chatName.name,
                          pseudo: ban.pseudo,
                          time: ban.time,
                          motif: ban.motif,
                        })
                      }
                    >
                      mute
                    </Button>
                    <Button
                      className="mb-10  px-2 py-1"
                      variant="contained"
                      color="active"
                      onClick={() => setInvite(!invite)}
                    >
                      invite user
                    </Button>
                    {invite && (
                      <span>
                        pseudo :
                        <input
                          className=" px-2 py-1"
                          type="text"
                          value={ban.pseudo}
                          onChange={(e) => {
                            setBan({
                              mute_ban: ban.mute_ban,
                              name: chatName.name,
                              pseudo: e.target.value,
                              time: ban.time,
                              motif: ban.motif,
                            });
                          }}
                          placeholder="Enter  pseudo"
                          name="chat"
                        />
                        {ban.pseudo && (
                          <Button
                            className="mb-10  px-2 py-1"
                            variant="contained"
                            color="active"
                            onClick={() => inviteChan(ban)}
                          >
                            envoie
                          </Button>
                        )}
                      </span>
                    )}
                    {ban.mute_ban === "mute" && (
                      <h3>
                        <div>
                          {ban.time != 0 && <text>{ban.time}</text>}
                          {ban.time == 0 && <text>def</text>}
                          <input
                            type="range"
                            id="volume"
                            name="volume"
                            default={10}
                            value={ban.time}
                            min="0"
                            max="100"
                            onChange={(e) => {
                              setBan({
                                mute_ban: ban.mute_ban,
                                name: chatName.name,
                                pseudo: ban.pseudo,
                                time: e.target.value,
                                motif: ban.motif,
                              });
                            }}
                          />
                        </div>
                        <label name="time mute">time mute </label>
                        pseudo :
                        <input
                          className=" px-2 py-1"
                          type="text"
                          value={ban.pseudo}
                          onChange={(e) => {
                            setBan({
                              mute_ban: ban.mute_ban,
                              name: chatName.name,
                              pseudo: e.target.value,
                              time: ban.time,
                              motif: ban.motif,
                            });
                          }}
                          placeholder="Enter  pseudo"
                          name="chat"
                        />
                        motif :
                        <input
                          className=" px-2 py-1"
                          type="text"
                          value={ban.motif}
                          onChange={(e) => {
                            setBan({
                              mute_ban: ban.mute_ban,
                              name: chatName.name,
                              pseudo: ban.pseudo,
                              time: ban.time,
                              motif: e.target.value,
                            });
                          }}
                          placeholder="Enter motif"
                          name="chat"
                        />
                        {ban.name != "" && ban.pseudo != "" && ban.time !== 0 && (
                          <Button
                            className="ml-3 px-2 py-1 mr-3"
                            variant="contained"
                            color="active"
                            onClick={() => Ban()}
                          >
                            envoie
                          </Button>
                        )}
                      </h3>
                    )}
                  </div>
                )}
                <div>
                  {chatName.name != "" && (
                    <p>
                      {msg
                        .filter(
                          (el) =>
                            el.channel === data.channel &&
                            useBlock.find((u) => u === el.pseudo) === undefined
                        )
                        .map((el, i) => (
                          <li key={i}>
                            {el.pseudo} : {el.texte}
                            {me !== el.pseudo && (
                              <span>
                                <Button
                                  key={i}
                                  className="ml-3 px-2 py-1"
                                  variant="contained"
                                  color="active"
                                  onClick={() => BlockedUser(el)}
                                >
                                  !
                                </Button>
                                <Button
                                  className="ml-3 px-2 py-1"
                                  variant="contained"
                                  color="active"
                                  onClick={() => demParti(el)}
                                >
                                  ?
                                </Button>
                              </span>
                            )}
                          </li>
                        ))}
                      <input
                        className=" px-2 py-1"
                        type="text"
                        value={data.texte}
                        onChange={(e) => {
                          setData({
                            channel: data.channel,
                            pseudo: data.pseudo,
                            texte: e.target.value,
                          });
                        }}
                        placeholder="Enter Character Name"
                        onKeyPress={(event) => {
                          event.key === "Enter" && sendMessage();
                        }}
                        name="chat"
                      />
                      <Button
                        className="ml-3 px-2 py-1"
                        variant="contained"
                        color="active"
                        onClick={() => sendMessage()}
                      >
                        Envoie
                      </Button>
                    </p>
                  )}
                  <p>
                    my channels :
                    {channel.map((el, i) => (
                      <Button
                        key={i}
                        className="ml-3 px-2 py-1"
                        variant="contained"
                        color="active"
                        onClick={() => changechannel(el)}
                      >
                        {el.name}
                      </Button>
                    ))}
                  </p>
                  channels public :{" "}
                  {channelPub.map((el, i) => (
                    <Button
                      key={i}
                      className="ml-3 px-2 py-1"
                      variant="contained"
                      color="active"
                      onClick={() => joinchannel(el)}
                    >
                      {el.name}
                    </Button>
                  ))}
                </div>
                <div>
                  {join.password && (
                    <h3>
                      {join.name} password :
                      <input
                        className=" px-2 py-1"
                        type="password"
                        value={passj.password}
                        onChange={(e) => {
                          setPassj({
                            name: join.name,
                            password: e.target.value,
                            private: passj.private,
                          });
                        }}
                        placeholder="Enter password"
                        onKeyPress={(event) => {
                          event.key === "Enter" && joinPass(passj);
                        }}
                        name="chat"
                      />
                      <Button
                        className="ml-3 px-2 py-1"
                        variant="contained"
                        color="active"
                        onClick={() => joinPass(passj)}
                      >
                        Envoie
                      </Button>
                    </h3>
                  )}
                </div>
              </div>
            )}
            {create && (
              <div>
                password:{" "}
                <input
                  className=" px-2 py-1"
                  type="password"
                  value={passj.password}
                  onChange={(e) => {
                    setPassj({
                      name: passj.name,
                      password: e.target.value,
                      private: passj.private,
                    });
                  }}
                  placeholder="Enter password"
                  name="chat"
                />
                name:{" "}
                <input
                  className=" px-2 py-1"
                  type="text"
                  value={passj.texte}
                  onChange={(e) => {
                    setPassj({
                      name: e.target.value,
                      password: passj.password,
                      private: passj.private,
                    });
                  }}
                  placeholder="name channel"
                  name="chat"
                />
                <div>
                  <input
                    type="radio"
                    id="private"
                    name="type"
                    value={passj.texte}
                    onChange={() => {
                      setPassj({
                        name: passj.name,
                        password: passj.password,
                        private: true,
                      });
                    }}
                  />
                  <label>private</label>

                  <input
                    type="radio"
                    id="public"
                    name="type"
                    value={passj.texte}
                    onChange={() => {
                      setPassj({
                        name: passj.name,
                        password: passj.password,
                        private: false,
                      });
                    }}
                    checked
                  />
                  <label>public</label>
                </div>
                {passj.name != "" && (
                  <Button
                    className="ml-3 px-2 py-1"
                    variant="contained"
                    color="active"
                    onClick={() => creatCha(passj)}
                  >
                    Envoie
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
        {cha_mp == 2 && (
          <div>
            <div>
              search users:{" "}
              <input
                className=" px-2 py-1"
                type="text"
                value={passj.texte}
                onChange={(e) => {
                  setPassj({
                    name: e.target.value,
                    password: passj.password,
                    private: passj.private,
                  });
                }}
                placeholder="name channel"
                name="chat"
              />
              {passj.name.length >= 1 && mp == "" && (
                <span>
                  {users
                    .filter((el) => el.startsWith(passj.name) === true)
                    .map((el, i) => (
                      <li key={i}>
                        {
                          <Button
                            key={i}
                            className="ml-3 px-2 py-1"
                            variant="contained"
                            color="active"
                            onClick={() => {
                              changechannel({
                                id: -1,
                                name: el,
                                private: true,
                                admin: false,
                                owner: false,
                                password: false,
                              });
                            }}
                          >
                            {el}
                          </Button>
                        }
                      </li>
                    ))}
                </span>
              )}
            </div>
            {mp != "" && (
              <div>
                {<h1>{data.channel}</h1>}
                {msg
                  .filter(
                    (el) =>
                      el.channel === data.channel &&
                      useBlock.find((u) => u === el.pseudo) === undefined
                  )
                  .map((el, i) => (
                    <li key={i}>
                      {el.pseudo} : {el.texte}
                      {me !== el.pseudo && (
                        <span>
                          <Button
                            className="ml-3 px-2 py-1"
                            variant="contained"
                            color="active"
                            onClick={() => BlockedUser(el)}
                          >
                            !
                          </Button>
                          <Button
                            className="ml-3 px-2 py-1"
                            variant="contained"
                            color="active"
                            onClick={() => demParti(el)}
                          >
                            ?
                          </Button>
                        </span>
                      )}
                    </li>
                  ))}
                <input
                  className=" px-2 py-1"
                  type="text"
                  value={data.texte}
                  onChange={(e) => {
                    setData({
                      channel: data.channel,
                      pseudo: data.pseudo,
                      texte: e.target.value,
                    });
                  }}
                  placeholder="message..."
                  onKeyPress={(event) => {
                    event.key === "Enter" && sendPrivate();
                  }}
                  name="chat"
                />
                <Button
                  className="ml-3 px-2 py-1"
                  variant="contained"
                  color="active"
                  onClick={() => sendPrivate()}
                >
                  Envoie
                </Button>
              </div>
            )}
            my message private :
            <span>
              {myMp.map((el, i) => (
                <Button
                  key={i}
                  className="ml-3 px-2 py-1"
                  variant="contained"
                  color="active"
                  onClick={() => {
                    changechannel(el);
                    setMp(el.name);
                    console.log(msg);
                  }}
                >
                  {el.name}
                </Button>
              ))}
            </span>
          </div>
        )}
        {cha_mp == 3 && (
          <div>
            <Button
              className="mb-10  px-2 py-1"
              variant="contained"
              color="active"
              onClick={() => {
                changefriendmode(1);
              }}
            >
              my friend
            </Button>
            <Button
              className="mb-10  px-2 py-1"
              variant="contained"
              color="active"
              onClick={() => {
                changefriendmode(2);
              }}
            >
              attend
            </Button>
            <Button
              className="mb-10  px-2 py-1"
              variant="contained"
              color="active"
              onClick={() => {
                changefriendmode(3);
              }}
            >
              demande friend
            </Button>
            {frienMode === 3 && (
              <div>
                search users:{" "}
                <input
                  className=" px-2 py-1"
                  type="text"
                  value={passj.texte}
                  onChange={(e) => {
                    setPassj({
                      name: e.target.value,
                      password: passj.password,
                      private: passj.private,
                    });
                  }}
                  placeholder="name channel"
                  name="chat"
                />
                {passj.name.length >= 1 && mp == "" && (
                  <span>
                    {users
                      .filter(
                        (el) =>
                          el.pseudo.startsWith(passj.name) === true &&
                          el.stastu === 0
                      )
                      .map((el, i) => (
                        <li key={i}>
                          {
                            <Button
                              key={i}
                              className="ml-3 px-2 py-1"
                              variant="contained"
                              color="active"
                              onClick={() => {
                                demfriend(el);
                              }}
                            >
                              {el.pseudo}
                            </Button>
                          }
                        </li>
                      ))}
                  </span>
                )}
              </div>
            )}
            {frienMode === 1 && (
              <div>
                {
                  <span>
                    {users
                      .filter((el) => el.stastu === 1)
                      .map((el, i) => (
                        <li key={i}>
                          {
                            <Button
                              key={i}
                              className="ml-3 px-2 py-1"
                              variant="contained"
                              color="active"
                              onClick={() => {
                                changechannel({
                                  id: -1,
                                  name: el,
                                  private: true,
                                  admin: false,
                                  owner: false,
                                  password: false,
                                });
                              }}
                            >
                              {el.pseudo}
                            </Button>
                          }
                        </li>
                      ))}
                  </span>
                }
              </div>
            )}
            {frienMode === 2 && (
              <div>
                {
                  <span>
                    {users
                      .filter((el) => el.stastu === 2 || el.stastu === 3)
                      .map((el, i) => (
                        <li key={i}>
                          {
                            <span>
                              <Button
                                key={i}
                                className="ml-3 px-2 py-1"
                                variant="contained"
                                color="active"
                                onClick={() => {
                                  supdemfirend(el);
                                }}
                              >
                                sup demande {el.pseudo}
                              </Button>

                              <Button
                                key={i}
                                className="ml-3 px-2 py-1"
                                variant="contained"
                                color="active"
                                onClick={() => {
                                  acceptfriend(el);
                                }}
                              >
                                acpt {el.pseudo}
                              </Button>

                              <Button
                                key={i}
                                className="ml-3 px-2 py-1"
                                variant="contained"
                                color="active"
                                onClick={() => {
                                  refusefriend(el);
                                }}
                              >
                                refuse {el.pseudo}
                              </Button>
                            </span>
                          }
                        </li>
                      ))}
                  </span>
                }
              </div>
            )}
          </div>
        )}
      </div>
    </RoundedContainer>
  );
};

export default Chat;
