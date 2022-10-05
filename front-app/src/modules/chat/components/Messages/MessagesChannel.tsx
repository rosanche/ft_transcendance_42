import { ReactNode } from "react";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { FriendItem } from "modules/profile/components/FriendItem/FriendItem";
import {
  OtherMessage,
  MyMessage,
} from "modules/chat/components/Message/Message";
import { users, form, pass, ban, channel } from "modules/chat/types";

interface Props {
  msg: form[];
  idCourant: number;
  idme: number;
}

export const MessagesChannel = (a: Props) => {
  //const { data: users, isLoading, status } = useUsersQuery();
  return a.msg
    ?.filter((e) => e.idReceive == a.idCourant)
    .map((el, i) => (
      <div key={i} className="m-1.5">
        {el.idSend != a.idme && (
          <div key={i} className="flex justify-start">
            <OtherMessage key={i} message={el} />
          </div>
        )}
        {el.idSend == a.idme && (
          <div key={i} className="flex justify-end">
            <MyMessage key={i} message={el} />
          </div>
        )}
      </div>
    ));
};
