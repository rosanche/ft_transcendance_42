import { ApiFriend, User } from "modules/profile/types";
import { UserItem } from "../UserItem/UserItem";

export const LeaderboardItem = (user: User, position: number) => {
  return (
    <div className="relative  flex-inline flex flex-row justify-center items-center">
      <span>{position}</span>
      <UserItem {...user} reverse={false} />
      <span></span>
    </div>
  );
};
