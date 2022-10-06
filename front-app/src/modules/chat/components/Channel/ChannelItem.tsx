import { ReactNode } from "react";
import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { users, form, pass, ban, channel } from "modules/chat/types";

interface Props {
  info: channel;
}

export const ChannelItem = (a: Props) => {
  return (
    <RoundedContainer>
      <span className="text-white">{a.info.name}</span>
    </RoundedContainer>
  );
};
