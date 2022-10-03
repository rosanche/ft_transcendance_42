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
    <RoundedContainer className="bg=pink">
      <Button
        className=""
        variant="contained"
        color="active"
        onClick={() => {}}
      >
        <span>{a.info.name}</span>
      </Button>
    </RoundedContainer>
  );
};
