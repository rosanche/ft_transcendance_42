import { ReactNode } from "react";
import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import React, { useState, useRef, useEffect } from "react";
import { users, form, pass, ban, channel } from "modules/chat/types";
import { useSocketContext } from "modules/common/context/SocketContext";

interface Props {
  info: channel;
}

export const ChannelCreate = () => {
  const [passj, setPassj] = useState<pass>({
    idChannel: 0,
    name: "",
    password: "",
    private: false,
  });
  const socket = useSocketContext();
  const creatCha = async (cha: pass) => {
    console.log(cha);
    console.log(socket.isConnected);
    socket.emit("creatcha", cha);
    setPassj({ name: "", password: "", private: false });
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  return (
    <div className="text-white">
      password:{" "}
      <input
        className=" px-2 py-1 text-black"
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
        className=" px-2 py-1 text-black"
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
            console.log("mute");
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
  );
};
