import { ReactNode } from "react";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { FriendItem } from "modules/profile/components/FriendItem/FriendItem";
//import  {form } from "pages/chat";
import { form, pass, ban, channel } from "modules/chat/types";
import { UserItem } from "modules/profile/components/UserItem/UserItem";
import { ApiFriend } from "modules/profile/types";

interface Props {
  message: form;
}

export const MyMessage = (a: Props) => {
  //const { data: users, isLoading, status } = useUsersQuery();
  return (
    <div className="mr-2">
      <div className="bg-pink text-white text-xl rounded-md flex justify-end m-0.5">
        <div className="mx-0.5 my-1">
          <span className="mx-2">{a.message?.texte}</span>
        </div>
      </div>
    </div>
  );
};

export const OtherMessage = (a: Props) => {
  const { data: users, isLoading, status } = useUsersQuery();
  const user = users?.find((el) => el.id === a.message.idSend);
  return (
    <div className="flex-row ml-2">
      <FriendItem
        {...user}
        type="friend"
        isBlocked={false}
        isInChannel={false}
      />
      <div className="flex bg-white text-black text-xl rounded-md m-0.5">
        <div className="flex my-1">
          {"  "}
          <span>{a.message?.texte}</span>
        </div>
      </div>
    </div>
  );
};
