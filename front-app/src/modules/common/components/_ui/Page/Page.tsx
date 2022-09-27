import { PropsWithChildren } from "react";
import { HeaderTitle } from "../HeaderTitle/HeaderTitle";
import { Spinner } from "../Spinner/Spinner";

interface Props {
  title?: string;
  isLoading?: boolean;
}

export const Page: React.FC<PropsWithChildren<Props>> = ({
  title,
  isLoading = false,
  children,
}) => {
  return (
    <div className="flex flex-1 flex-col items-center">
      {title && <HeaderTitle title={title} />}

      <div className="flex flex-1 flex-col content-around justify-center">
        {isLoading ? (
          <Spinner className="text-white h-8 w-8 mb-10" />
        ) : (
          children
        )}
      </div>
    </div>
  );
};
