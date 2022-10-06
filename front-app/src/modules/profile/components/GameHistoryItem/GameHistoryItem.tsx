import { Spinner } from "modules/common/components/_ui/Spinner/Spinner";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { ApiFriend, ApiGame } from "modules/profile/types";
import { FriendItem } from "../FriendItem/FriendItem";
import { useState, useEffect } from "react";
import { UserItem } from "../UserItem/UserItem";

export const GameHistoryItem = ({
  id,
  id_1,
  id_2,
  score_1,
  score_2,
  winner,
}: ApiGame) => {
  const { data: users, isLoading, status } = useUsersQuery();
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      setUser1(
        users.find((el: ApiFriend) => {
          return el.id == id_1;
        })
      );
      setUser2(
        users.find((el: ApiFriend) => {
          return el.id == id_2;
        })
      );
    }
  }, [isLoading, users]);

  const color1 = winner === id_1 ? "text-amber-300" : "text-rose-700";
  const color2 = winner === id_2 ? "text-amber-300" : "text-rose-700";

  return (
    <div className="relative  flex-inline flex flex-row justify-center items-center">
      {!isLoading ? (
        <>
          <UserItem className="m-2 flex-none " {...user1} />
          <div className=" flex-none place-items-center ">
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
          <UserItem className="m-2 flex-none " {...user2} reverse={true} />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
