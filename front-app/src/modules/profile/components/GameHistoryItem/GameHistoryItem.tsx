import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { ApiGame } from "modules/profile/types";
import { FriendItem } from "../FriendItem/FriendItem";

export const GameHistoryItem = ({
  id,
  id_1,
  id_2,
  score_1,
  score_2,
  winner,
}: ApiGame) => {
  const { data: users, isLoading, status } = useUsersQuery();

  const user1 = users[id_1 - 1];
  const user2 = users[id_2 - 1];
  const color1 = winner == 1 ? "text-amber-300" : "text-rose-700";
  const color2 = winner == 2 ? "text-amber-300" : "text-rose-700";

  return (
    <div className="flex flex-row justify-center items-center">
      <FriendItem
        className="m-2 flex-grow"
        {...user1}
        type="friend_resume"
        isBlocked={false}
      />
      <div className="flex-none place-items-center">
        <span
          className={
            color1 + " text-3xl  font-bold  text-align: center m-1 ml-3"
          }
        >
          {score_1 + " "}
        </span>
        <span className="text-white text-3xl  font-bold  text-align: center">
          :
        </span>
        <span
          className={
            color2 + " text-3xl  font-bold  text-align: center m-1 mr-3"
          }
        >
          {" " + score_2}
        </span>
      </div>
      <FriendItem
        className="m-2 flex-grow"
        {...user2}
        type="friend_resume"
        isBlocked={false}
      />
    </div>
  );
};
