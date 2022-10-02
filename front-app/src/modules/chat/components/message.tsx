import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";
import { HeaderTitle } from "../HeaderTitle/HeaderTitle";
import { Button } from "modules/common/components/_ui/Button/Button";

interface Props {
  className?: string;
  title?: string;
  button?: ReactNode;
}

export const messageTest = () => {
  return (
    <Button
      className="ml-[0.5rem] w-[rem4.5]"
      variant="contained"
      color="active"
      onClick={() => {}}
    >
      dd
    </Button>
  );
};
