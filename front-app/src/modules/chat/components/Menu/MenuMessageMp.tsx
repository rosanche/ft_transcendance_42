import { ReactNode } from "react";
import { useUsersQuery } from "modules/profile/queries/useUsersQuery";
import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { FriendItem } from "modules/profile/components/FriendItem/FriendItem";
import {
  OtherMessage,
  MyMessage,
} from "modules/chat/components/Message/Message";
import { UserMp } from "modules/chat/components/Menu/Messagemp";
import { useChannelContext } from "modules/chat/context/ChannelContext";

type form = {
  idSend: number;
  idReceive: number;
  texte: string;
};

type user = {
  id: number;
  pseudo: string;
  stastu: number;
  blocked: boolean;
  myblocked: boolean;
};

interface Props {
  key: string;
  users: user[];
  msgMp: form[];
}

export const MenuMessagesMp = (a: Props) => {
  const { chatName, changeChatName } = useChannelContext();
  //const { data: users, isLoading, status } = useUsersQuery();
  return a.users
    ?.filter((v) => a.msgMp.find((u) => u.idReceive === v.id) != undefined)
    .map((el, i) => (
      <Button
        key={i}
        className=""
        variant="link"
        color=""
        onClick={() => {
          changeChatName(el);
        }}
      >
        <UserMp key={i} user={el} />
      </Button>
    ));
};
