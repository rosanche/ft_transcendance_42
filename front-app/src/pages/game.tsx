import { Page } from "modules/common/components/_ui/Page/Page";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { useSocketContext } from "modules/common/context/SocketContext";
import Canvas from "modules/game/Canvas";

import React, { useEffect } from "react";

export default function Game() {
  const SSR = typeof window === "undefined";
  const socket = useSocketContext();

  useEffect(() => {
    console.log("$$connected", socket.connected);
    if (!socket.connected) {
      socket.connect();
    }
  }, [socket]);

  console.log("socket connected", socket.connected);
  return (
    <Page>
      <RoundedContainer className="px-14 py-20 ml-36 mt-16 m-10">
        <div>{<Canvas width={1600} height={900} />}</div>
      </RoundedContainer>
    </Page>
  );
}
