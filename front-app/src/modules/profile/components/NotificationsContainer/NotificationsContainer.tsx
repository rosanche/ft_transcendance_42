import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { ApiFriend, Friend } from "modules/profile/types";
import { FriendItem } from "../FriendItem/FriendItem";

interface Props {
  friends: ApiFriend[];
}

export const NotificationsContainer = ({ friends }: Props) => {
  return (
    <RoundedContainer
      className="px-10 py-9 justu"
      title="Mes ami(e)s"
      button={<Button variant="link">Voir tout</Button>}
    >
      <div className="flex flex-col">
        {friends?.map((friend) => (
          <FriendItem {...friend} type="friend_request" />
        ))}
      </div>
    </RoundedContainer>
  );
};
