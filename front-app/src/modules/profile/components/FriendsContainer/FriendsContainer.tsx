import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { ApiFriend, Friend, FriendType } from "modules/profile/types";
import { FriendItem } from "../FriendItem/FriendItem";
import { useAddFriendModal } from "../useAddFriendModal/useAddFriendModal";

interface Props {
  friends: ApiFriend[] & FriendType;
}

export const FriendsContainer = ({ friends }: Props) => {
  const { showModal } = useAddFriendModal();

  return (
    <RoundedContainer
      className="px-10 py-9"
      title="Mes ami(e)s"
      button={
        <Button variant="link" onClick={showModal}>
          Ajouter un ami
        </Button>
      }
    >
      <div className="flex flex-col">
        {friends?.map((friend) => (
          <FriendItem {...friend} type="friend" isBlocked={false} />
        ))}
      </div>
    </RoundedContainer>
  );
};
