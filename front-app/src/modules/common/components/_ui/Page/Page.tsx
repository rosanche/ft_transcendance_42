import { PropsWithChildren } from "react";
import { HeaderTitle } from "../HeaderTitle/HeaderTitle";

interface Props {
  title?: string;
}

export const Page: React.FC<PropsWithChildren<Props>> = ({
  title,
  children,
}) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {title && <HeaderTitle title={title} />}
      {children}
    </div>
  );
};
