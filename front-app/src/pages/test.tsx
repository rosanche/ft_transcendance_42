import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "modules/common/components/_ui/Button/Button";
import socketio from "socket.io-client";
import { useRouter } from "next/router";
import { Page } from "modules/common/components/_ui/Page/Page";

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
    <Page titre="test">
      <div className="flex flex-1 flex-row h-5/6">
        <RoundedContainer className="flex flex-1 top-4 items-start">
          <span>ijgfuhbkfdnjkgbvjnjktbnjgfnjkbngfjlnbjkl</span>
        </RoundedContainer>
        <div className="flex flex-1  flex-col justify-between">
          <span className="text-white">Kelly</span>
          <div className="flex justify-end h-14  w-11/12  mr-5 mb-10">
            <input className="rounded-lg ml-5 w-11/12 " type="text"></input>
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
