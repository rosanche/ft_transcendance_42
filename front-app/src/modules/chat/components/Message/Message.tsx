import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { FriendItem } from "modules/profile/components/FriendItem/FriendItem";
//import  {form } from "pages/chat";
import { form } from "modules/chat/types";
import { useSocketContext } from "modules/common/context/SocketContext";

interface Props {
  message: form;
}

export const MyMessage = (a: Props) => {
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
      <FriendItem {...user} type="friend" isBlocked={false} />
      <div className="flex bg-white text-black text-xl rounded-md m-0.5">
        <div className="flex my-1">
          {"  "}
          <span>{a.message?.texte}</span>
        </div>
      </div>
    </div>
  );
};
