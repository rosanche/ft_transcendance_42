import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "modules/common/components/_ui/Button/Button";
import socketio from "socket.io-client";
import { useRouter } from "next/router";
import Image from "next/image";
import { Page } from "modules/common/components/_ui/Page/Page";
import { IconMessage } from "modules/common/components/_icons/icons";
import { messageTest } from "modules/chat/components/message";

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

const test = () => {
  return (
    <Page titre="test" className="">
      <div className="flex flex-1 flex-col">
        <div className="text-center m-4 ">
          <span className="text-white font-bold text-4xl leading-[3rem]">
            Chat
          </span>
        </div>
        <div className="flex flex-1 flex-row h-5/6">
          <RoundedContainer className="flex w-1/3 flex-1 mu-3 items-start mb-9">
            <span className="text-white">
              ijgfuhbkfdnjkgbvjnjktbnjgfnjkbngfjlnbjkl
            </span>
          </RoundedContainer>
          <div className="flex flex-1 flex-col ml-8 w-2/3 justify-between ">
            <span className="text-white font-medium text-xl text-center leading-[3rem]">
              Kelly
            </span>
            <RoundedContainer className="flex flex-1 mu-3 items-start mb-9">
              <div className="w-7 h-7 shadow-sm mt-2 relative">
                <Image
                  layout="fill"
                  src={"/assets/img/ljulien.jpg"}
                  className="rounded-full"
                />
              </div>
              <span className="text-white">
                ijgfuhbkfdnjkgbvjnjktbnjgfnjkbngfjlnbjkl
              </span>
            </RoundedContainer>
            <div className="flex flex-row  h-8 mb-10">
              <input className="rounded-lg flex " type="text"></input>
              <Button
                className="ml-4 text-center items-center  align-middle"
                variant="contained"
                color="active"
                icon={<IconMessage />}
                onClick={() => {}}
              >
                envoie
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default test;
