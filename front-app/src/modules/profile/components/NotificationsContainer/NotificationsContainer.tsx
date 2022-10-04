import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { useSocketContext } from "modules/common/context/SocketContext";
import { ApiFriend, Friend } from "modules/profile/types";
import { useEffect, useState } from "react";
import { FriendItem } from "../FriendItem/FriendItem";

interface Props {
  friends: ApiFriend[];
}

export const NotificationsContainer = ({ friends }: Props) => {
  const socket = useSocketContext();
  const [gameInvitations, setGameInvitations] = useState<number[]>([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("list game invitations", (invitations: number[]) => {
      setGameInvitations(invitations);
      console.log("$$Status invitations", invitations);
      console.log("$$Status user", status);
    });

    socket.emit("Get Game Invitations");
  }, []);

  return (
    <RoundedContainer
      className="px-10 py-9 justu"
      title="Mes notifs"
      button={<Button variant="link">Voir tout</Button>}
    >
      <div className="flex flex-col">
        {friends?.map((friend) => (
          <FriendItem {...friend} type="friend_request" />
        ))}
      </div>
    </RoundedContainer>
  );
};
