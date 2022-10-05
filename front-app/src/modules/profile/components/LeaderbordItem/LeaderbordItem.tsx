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
    <div
      className={
        "relative rounded-md text-lg  m-2 flex-inline flex flex-row justify-between items-center " +
        color
      }
    >
      <span className="ml-10 text-white text-2xl">{position}</span>
      <UserItem {...user} reverse={false} />
      <span className="mr-4  text-white text-2xl">Wins: {user?.nbr_wins}</span>
    </div>
  );
};
