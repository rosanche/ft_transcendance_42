import { ApiGame } from "modules/profile/types";

export const GameHistoryItem = ({
  id_1,
  id_2,
  score_1,
  score_2,
  winner,
}: ApiGame) => {
  return (
    <div>
      <span className={winner == 1 ? "text-amber-500" : "text-white"}>
        {id_1} {score_1}
      </span>
      <span>:</span>
      <span className={winner == 1 ? "text-amber-500" : "text-white"}>
        {score_2} {id_2}
      </span>
    </div>
  );
};
