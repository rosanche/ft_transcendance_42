import React, { createContext, useContext } from "react";
import socketio, { Socket } from "socket.io-client";
import { CookieKeys } from "../types";
import Cookies from "js-cookie";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useAppContextState } from "./AppContext";

const SocketContext =
  createContext<Socket<DefaultEventsMap, DefaultEventsMap>>(undefined);

const accessToken = Cookies.get(CookieKeys.ACCESS_TOKEN);

interface Props {
  children: React.ReactNode;
}
const SocketContextProvider = ({ children }: Props) => {
  const { accessToken: token } = useAppContextState();
  // console.log("$$autoconnect", !!accessToken)
  const socket = socketio("http://localhost:3000/chat", {
    autoConnect: !!accessToken,
    auth: {
      token: token,
    },
  });

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

function useSocketContext() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
}
export { SocketContextProvider, useSocketContext };
