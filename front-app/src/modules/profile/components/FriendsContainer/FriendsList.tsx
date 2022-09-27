import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { Friend } from "modules/profile/types";
import { FriendItem } from "../FriendItem/FriendItem";

interface Props {
  friends: Friend[];
}

export const FriendsContainer = ({ friends }: Props) => {
  return (
    <RoundedContainer
      className="px-10 py-9"
      title="Mes ami(e)s"
      button={<Button variant="link">Voir tout</Button>}
    >
      {friends.map((friend) => (
        <FriendItem {...friend} />
      ))}
    </RoundedContainer>
  );
};
