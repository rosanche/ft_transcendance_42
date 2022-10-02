import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { GameHistoryItem } from "../GameHistoryItem/GameHistoryItem";
import { ApiGame } from "modules/profile/types";

interface Props {
  games: ApiGame[];
}

export const GameHistoryContainer = ({ games }: Props) => {
  return (
    <RoundedContainer
      className="px-10 py-9"
      title="Mes Parties"
      button={<Button variant="link">Mes parties</Button>}
    >
      <div className="flex flex-col">
        {games?.map((game) => (
          <GameHistoryItem {...game} />
        ))}
      </div>
    </RoundedContainer>
  );
};
