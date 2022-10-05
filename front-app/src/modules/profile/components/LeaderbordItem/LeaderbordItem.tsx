import { ApiFriend, User } from "modules/profile/types";
import { UserItem } from "../UserItem/UserItem";

interface Props {
  user: User;
  position: number;
}

export const LeaderboardItem = ({ user, position }): Props => {
  return (
    <div className="relative bg-pink rounded-md text-lg  m-2 flex-inline flex flex-row justify-between items-center">
      <span className="ml-10  text-2xl">{position}</span>
      <div className=" bg-black rounded-full m-1">
        <UserItem {...user} reverse={false} />
      </div>
      <span className="mr-4  text-2xl">Wins: {user?.nbr_wins}</span>
    </div>
  );
};
