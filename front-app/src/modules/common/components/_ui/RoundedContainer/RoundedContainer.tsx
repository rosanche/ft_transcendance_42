import clsx from "clsx";
import { PropsWithChildren } from "react";
import { HeaderTitle } from "../HeaderTitle/HeaderTitle";

interface Props {
  className?: string;
}

export const RoundedContainer: React.FC<PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center bg-gray-dark rounded-xl shadow-right shadow-bottom",
        className
      )}
    >
      {children}
    </div>
  );
};
