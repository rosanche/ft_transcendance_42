import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { AchievementsItem } from "../AchievementsItem/AchievementsItem";

interface Props {
  id: number;
}

export const AchievementsContainer = ({ id }: Props) => {
  const { data: users, isLoading, status } = useUsersQuery();
  const user = users?.find((el) => {
    return el.id == id;
  });
  return (
    <RoundedContainer>
      <div className="grid min-w-min grid-cols-3 grid-rows-2">
        <AchievementsItem
          text="Gagner 1 match"
          isValidate={user?.nbr_wins >= 1}
        />
        <AchievementsItem
          text="Gagner 2 matchs"
          isValidate={user?.nbr_wins >= 2}
        />
        <AchievementsItem
          text="Gagner 5 matchs"
          isValidate={user?.nbr_wins >= 5}
        />
        <AchievementsItem
          text="Jouer 5 matchs"
          isValidate={user?.nbr_games >= 5}
        />
        <AchievementsItem
          text="Changer son avatar"
          isValidate={user?.profileImage != null}
        />
        <AchievementsItem
          text="Ajouter un ami"
          isValidate={user?.myfriends.length >= 1}
        />
        <AchievementsItem
          text="Atteindre le level 1"
          isValidate={user?.level >= 1}
        />
        <AchievementsItem
          text="Atteindre le level 2"
          isValidate={user?.level >= 2}
        />
        <AchievementsItem
          text="Atteindre le level 5"
          isValidate={user?.level >= 5}
        />
      </div>
    </RoundedContainer>
  );
};
