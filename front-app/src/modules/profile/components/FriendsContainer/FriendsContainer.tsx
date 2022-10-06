import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { ApiFriend, Friend, FriendType, User } from "modules/profile/types";
import { FriendItem } from "../FriendItem/FriendItem";
import { useAddFriendModal } from "../useAddFriendModal/useAddFriendModal";

interface Props {
  friends: (User &
    FriendType & {
      isBlocked: boolean;
    })[];
  withAddFriendButton: boolean;
}

export const FriendsContainer = ({
  friends,
  withAddFriendButton = false,
}: Props) => {
  const { showModal } = useAddFriendModal({
    isInChannel: false,
  });

  return (
    <RoundedContainer
      className="px-10 py-9"
      title="Mes ami(e)s"
      button={
        withAddFriendButton && (
          <Button variant="link" onClick={showModal}>
            Ajouter un ami
          </Button>
        )
      }
    >
      <div className="flex flex-col">
        {friends?.map((friend) => {
          const { id, pseudo, legend, profileImage } = friend;
          return (
            <FriendItem
              {...{ id, pseudo, legend, profileImage }}
              isBlocked={friend.isBlocked}
              key={friend.id}
              type="friend"
            />
          );
        })}
      </div>
    </RoundedContainer>
  );
};
