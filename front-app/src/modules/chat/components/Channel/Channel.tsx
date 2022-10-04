import { ReactNode } from "react";
import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";

type channel = {
  id: number;
  name: string;
  private: boolean;
  user: boolean;
  admin: boolean;
  owner: boolean;
  password: boolean;
};

interface Props {
  info: channel;
}

export const Channel = (a: Props) => {
  return (
    <RoundedContainer>
        <span className="text-white">{a.info.name}</span>
    </RoundedContainer>
  );
};
