import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { StatsItem } from "../StatsItem/StatsItem";

interface Props {
  id: number;
}

export const StatsContainer = ({ id }: Props) => {
  const { data: users, isLoading, status } = useUsersQuery();
  const user = users?.find((el) => {
    return el.id == id;
  });
  return (
    <div className="grid min-w-min grid-cols-3 grid-rows-2">
      <StatsItem title="Level" info={user?.level} />
      <StatsItem type="positive" title="Wins" info={user?.nbr_wins} />
      <StatsItem type="negative" title="Looses" info={user?.nbr_looses} />
      <StatsItem title="Match Played" info={user?.nbr_games} />
      <StatsItem type="positive" title="Goal For" info={user?.goals_f} />
      <StatsItem type="negative" title="Goal Against" info={user?.goals_a} />
    </div>
  );
};
