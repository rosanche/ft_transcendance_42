import { ReactNode, useState, useEffect } from "react";
import {
  OtherMessage,
  MyMessage,
} from "modules/chat/components/Message/Message";
import { form } from "modules/chat/types";
import { useSocketContext } from "modules/common/context/SocketContext";

interface Props {
  msg: form[];
  idCourant: number;
  idme: number;
}

export const MessagesChannel = (a: Props) => {
  const socket = useSocketContext();
  const [blocked, SetBlocked] = useState<number[]>([]);

  useEffect(() => {
    console.log(socket.connected);
    if (socket.connected)
    {
      socket.emit("me blocks");
    }
    socket.on("use info block", (c: number[]) => {
      SetBlocked(c);
      console.log("toi et vous", c);
    });
  }, [socket]);

  //const { data: users, isLoading, status } = useUsersQuery();
  return a.msg
    ?.filter((e) => e.idReceive == a.idCourant)
    .map((el, i) => (
      <div key={i} className="m-1.5">
        {el.idSend != a.idme &&
          blocked.find((block) => block === el.idSend) === undefined && (
            <div key={i} className="flex justify-start">
              <OtherMessage key={i} message={el} />
            </div>
          )}
        {el.idSend == a.idme && (
          <div key={i} className="flex justify-end">
            <MyMessage key={i} message={el} />
          </div>
        )}
      </div>
    ));
};
