import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { AchievementsItem } from "../AchievementsItem/AchievementsItem";

interface Props {
  id: number;
}

export const LeaderboardContainer = ({ id }: Props) => {
  const { data: users, isLoading, status } = useUsersQuery();

  return (
    <RoundedContainer>
      <div className="flex-col min-w-min">
        {users
          ?.sort((a, b) => b.nbr_wins - a.nbr_wins)
          .map((user, i) => (
            <AchievementsItem key={i} text="Gagner 1 match" />
          ))}
      </div>
    </RoundedContainer>
  );
};
