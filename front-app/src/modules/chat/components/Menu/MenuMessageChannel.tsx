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
import { usersChannel, form, pass, ban, Channel } from "modules/chat/types";
import { ChannelItem } from "../Channel/ChannelItem";

interface Props {
  channels: Channel[];
}

export const MenuMessagesChannel = (a: Props) => {
  const { chatName, changeChatName } = useChannelContext();
  //const { data: users, isLoading, status } = useUsersQuery();
  return a.channels?.map((el, i) => (
    <div key={i}>
      <Button
        key={i}
        className=""
        variant="link"
        color=""
        onClick={() => {
          changeChatName(el);
        }}
      >
        <ChannelItem key={i} info={el} />
      </Button>
    </div>
  ));
};
