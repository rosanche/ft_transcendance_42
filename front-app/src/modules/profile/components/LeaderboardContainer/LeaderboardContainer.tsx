import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { LeaderboardItem } from "../LeaderbordItem/LeaderbordItem";

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
            <LeaderboardItem id={id} user={user} key={i} position={i + 1} />
          ))}
      </div>
    </RoundedContainer>
  );
};
