import { ApiFriend, User } from "modules/profile/types";
import { UserItem } from "../UserItem/UserItem";

interface Props {
  user: User;
  position: number;
  id: number;
}

export const LeaderboardItem = ({ user, position, id }): Props => {
  let color = user.id === id ? " bg-green" : " bg-black";
  return (
    <div className="relative bg-pink rounded-md text-lg  m-2 flex-inline flex flex-row justify-between items-center">
      <span className="ml-10  text-2xl">{position}</span>
      <div className={"rounded-full m-1 " + color}>
        <UserItem {...user} reverse={false} />
      </div>
      <span className="mr-4  text-2xl">Wins: {user?.nbr_wins}</span>
    </div>
  );
};
