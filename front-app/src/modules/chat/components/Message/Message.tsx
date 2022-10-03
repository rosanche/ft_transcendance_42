import { ReactNode } from "react";
import { Button } from "modules/common/components/_ui/Button/Button";
import { RoundedContainer } from "modules/common/components/_ui/RoundedContainer/RoundedContainer";
//import  {form } from "pages/chat";

type form = {
  idSend: number;
  idReceive: number;
  texte: string;
};

interface Props {
  message: form;
}

export const Message = (a: Props) => {
  return (
    <RoundedContainer className="bg=pink">
      <span>
        {a.message?.idSend} : {a.message?.texte}
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
