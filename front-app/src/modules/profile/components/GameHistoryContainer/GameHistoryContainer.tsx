import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { GameHistoryItem } from "../GameHistoryItem/GameHistoryItem";
import { ApiGame } from "modules/profile/types";
import { useState } from "react";
import { useGameHistoryQuery } from "modules/profile/queries/useGameHistoryQuery";

interface Props {
  id: number;
}

export const GameHistoryContainer = ({ id }: Props) => {
  const [myGames, setMyGames] = useState(true);
  const { data: games } = useGameHistoryQuery();

  return (
    <RoundedContainer
      className="px-10 py-9"
      title={myGames ? "Mes parties" : "Toutes les parties"}
      button={
        <Button
          variant="link"
          onClick={() => {
            myGames ? setMyGames(false) : setMyGames(true);
          }}
        >
          {myGames ? "Voir mes parties" : "Voir tout"}
        </Button>
      }
    >
      <div className="flex flex-col">
        {games
          ?.filter((el) => {
            return el.id_1 == id || el.id_2 == id || !myGames;
          })
          .map((game) => (
            <GameHistoryItem key={game.id} {...game} />
          ))}
      </div>
    </RoundedContainer>
  );
};
