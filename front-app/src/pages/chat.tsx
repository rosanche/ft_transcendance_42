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

const Chat = () => {
  const socket = useSocketContext();
  console.log("$$socket", socket);
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

  const quit = async (chat: channel) => {
    await socket.emit("quit", chat);

    const u = await channel.filter((el) => chat.name !== el.name);
    console.log(u);
    await setChannel(u);
    console.log(channel);
    await setChatName(channel[0]);
    await console.log(chatName);
    const a: channel = await channel.at(0);
    console.log(a.name);
    await setData({ pseudo: data.pseudo, channel: a.name, texte: "" });
    setChannelPub([...channelPub, chat]);
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

  const changechannel = (el: channel) => {
    setData({ channel: el.name, pseudo: data.pseudo, texte: "" });
    setChatName(el);
    console.log(chatName);
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

  const log = (ms: Form) => {
    console.log(ms);
    setMsg((m) => [...m, ms]);
    //setChannel([...channel,  ms.text])

    //   setMsg([...msg, data]);
    //setData({channel: chatName, pseudo : data.pseudo ,texte: ""});
  };
  useEffect(() => {
    console.log("AAAAA");

    ("owner no left");
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
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <RoundedContainer className="px-14 py-20 mt-16 bg-indigo-200">
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
            <Button
              className="mb-10  px-2 py-1"
              variant="contained"
              color="active"
              onClick={() => quit(chatName)}
            >
              quit
            </Button>
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

                {ban.mute_ban === "mute" && (
                  <h3>
                    <input
                      type="range"
                      id="volume"
                      name="volume"
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
              <p>
                {msg
                  .filter((el) => el.channel === data.channel)
                  .map((el, i) => (
                    <li key={i}>
                      {el.pseudo} : {el.texte}
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
    </RoundedContainer>
  );
};

export default Chat;
