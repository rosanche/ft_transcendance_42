import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";
import { HeaderTitle } from "../HeaderTitle/HeaderTitle";

interface Props {
  className?: string;
  title?: string;
  button?: ReactNode;
}

export const RoundedContainer: React.FC<PropsWithChildren<Props>> = ({
  className,
  children,
  title,
  button,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col bg-gray-dark rounded-xl shadow-right shadow-bottom",
        className
      )}
    >
      {title && (
        <div className="flex flex-row justify-between">
          <span className="text-base text-gray-light font-default">
            {title}
          </span>
          {button}
        </div>
      )}
      {children}
    </div>
  );
};
