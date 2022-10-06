import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { useSocketContext } from "modules/common/context/SocketContext";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { ApiFriend, Friend } from "modules/profile/types";
import { useEffect, useState } from "react";
import { FriendItem } from "../FriendItem/FriendItem";

interface Props {
  friends: ApiFriend[];
}

export const NotificationsContainer = ({ friends }: Props) => {
  const socket = useSocketContext();
  const { data: users, isLoading, status } = useUsersQuery();
  const [gameInvitationsIds, setGameInvitationsIds] = useState<number[]>([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("list game invitations", (invitations: number[]) => {
      setGameInvitationsIds(invitations);
      console.log("$$Status invitations", invitations);
      console.log("$$Status gameInvitationsIds ", gameInvitationsIds);
    });

    socket.emit("Get Game Invitations");
  }, []);

  useEffect(() => {
    console.log(
      "$$merde",
      users,
      gameInvitationsIds,
      users?.map((user) => gameInvitationsIds.some((id) => id === user.id))
    );
  }, [isLoading, status]);

  return (
    <RoundedContainer
      className="px-10 py-9 justu"
      title="Mes notifs"
      button={<Button variant="link">Voir tout</Button>}
    >
      <div className="flex flex-col">
        {friends?.map((friend) => (
          <FriendItem
            {...friend}
            key={friend.id}
            type="friend_request"
            isIn="notification"
            isBlocked={false}
          />
        ))}
        {users?.map(
          (user) =>
            gameInvitationsIds.some((id) => id === user.id) && (
              <FriendItem
                {...user}
                key={user.id}
                type="game_request"
                isIn="notification"
                isBlocked={false}
              />
            )
        )}
      </div>
    </RoundedContainer>
  );
};
