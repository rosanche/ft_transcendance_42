import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "modules/common/components/_ui/Button/Button";
import socketio from "socket.io-client";
import { useRouter } from "next/router";
import { Page } from "modules/common/components/_ui/Page/Page";
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
    <Page titre="test" className="W-full">
      <div className="flex flex-1 flex-row h-5/6">
        <RoundedContainer className="flex flex-1  mu-3 items-start mb-9">
          <span className="text-white">dddddddddddddd</span>
        </RoundedContainer>
        <div className="flex flex-1  flex-col justify-between w-full">
          <span className="text-white">Kelly</span>
          <div className="flex justify-end h-8   mr-5 mb-10">
            <input className="rounded-lg ml-5 " type="text"></input>
            <messageTest/>
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
};

export default test;
