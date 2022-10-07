import { ReactNode } from "react";
import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
import { users, form, pass, ban, channel } from "modules/chat/types";
import ActionsChannel from "../ActionsChannel/ActionsChannel";
import IconLock from "modules/common/components/_icons/lock";

interface Props {
  info: channel;
}

export const ChannelItem = (a: Props) => {
  return (
    <RoundedContainer>
      <div className="flex flex-row text-white">{a.info.name} {a.info.admin && a.info.owner && (
          <span className="ml-1">(owner)</span>
        )}
        {a.info.admin && !a.info.owner && <span>(admin)</span>}
        {!a.info.admin && !a.info.owner && a.info.user &&<span>(user)</span> }
        {!a.info.admin && !a.info.owner && !a.info.user &&<span>(no join)</span> } 
        {a.info.private ? <IconLock /> : <></>}
           </div>
    </RoundedContainer>
  );
};
