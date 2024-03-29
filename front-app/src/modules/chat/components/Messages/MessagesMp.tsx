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
  msgMp: form[];
  idCourant: number;
  idme: number;
}

export const MessagesMp = (a: Props) => {
  //const { data: users, isLoading, status } = useUsersQuery();
  return a.msgMp
    ?.filter((e) => e.idReceive == a.idCourant)
    .map((el, i) => (
      <div className="m-1.5" key={i}>
        {el.idSend != a.idme && (
          <div className="flex justify-start">
            <OtherMessage key={i} message={el} />
          </div>
        )}
        {el.idSend == a.idme && (
          <div className="flex justify-end">
            <MyMessage key={i} message={el} />
          </div>
        )}
      </div>
    ));
};
