import { ReactNode } from "react";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { FriendItem } from "modules/profile/components/FriendItem/FriendItem";
//import  {form } from "pages/chat";

type form = {
  idSend: number;
  idReceive: number;
  texte: string;
};

interface Props {
  message: form;
}

export const MyMessage = (a: Props) => {
  //const { data: users, isLoading, status } = useUsersQuery();
  return (
    <div Key={a.key} className="mr-2">
      <div className="bg-pink text-white text-xl rounded-md flex justify-end m-0.5">
        <div className="mx-0.5 my-1">
          <span className="mx-2">{a.message?.texte}</span>
        </div>
      </div>
    </div>
  );
};

export const OtherMessage = (a: Props) => {
  //const { data: users, isLoading, status } = useUsersQuery();
  return (
    <div Key={a.key} className="ml-2">
      <div className="bg-white text-black text-xl rounded-md m-0.5">
        <div className="my-1">
          <span className="mx-2">{a.message?.texte}</span>
        </div>
      </div>
    </div>
  );
};
