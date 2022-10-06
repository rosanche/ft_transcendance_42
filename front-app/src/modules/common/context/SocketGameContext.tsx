import React, { createContext, useContext, PropsWithChildren } from "react";
import socketio, { Socket } from "socket.io-client";
import { CookieKeys } from "../types";
import Cookies from "js-cookie";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useAppContextState } from "./AppContext";

const SocketGameContext =
  createContext<Socket<DefaultEventsMap, DefaultEventsMap>>(undefined);

const accessToken = Cookies.get(CookieKeys.ACCESS_TOKEN);

// interface Props {
//   children: React.ReactNode;
// }
const SocketGameContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { accessToken: token } = useAppContextState();
  console.log("$$autoconnect", !!accessToken);
  const socket = socketio("http://localhost:3000/game", {
    autoConnect: false,
    auth: {
      token: token,
    },
  });

  return (
    <SocketGameContext.Provider value={socket}>
      {children}
    </SocketGameContext.Provider>
  );
};

function useSocketGameContext() {
  const context = useContext(SocketGameContext);
  if (context === undefined) {
    throw new Error(
      "useSocketGameContext must be used within a SocketGameContextProvider"
    );
  }
  return context;
}
export { SocketGameContextProvider, useSocketGameContext };
