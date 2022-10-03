import { ReactNode } from "react";
import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";

interface Props {
  idSend?: number;
  idReceive: number;
  texte: number;
}

export const Message = (a: Props) => {
  return (
    <RoundedContainer className="bg=pink">
      <span>
        {a.idSend} : {a.texte}
      </span>
    </RoundedContainer>
    /*
    <Button
      className="ml-[0.5rem] w-[rem4.5]"
      variant="contained"
      color="active"
      onClick={() => {}}
    >
      dd
    </Button>*/
  );
};
