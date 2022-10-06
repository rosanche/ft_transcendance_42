import Cookies from "js-cookie";
import { useSideBarContext } from "modules/common/context/SideBarContext";
import { EnumRoutes } from "modules/common/routes";
import { CookieKeys } from "modules/common/types";
import { PropsWithChildren } from "react";
import IconEnter from "../../_icons/enter";
import IconGame from "../../_icons/game";
import IconMessage from "../../_icons/message";
import IconProfil from "../../_icons/profil";
import { Button } from "../Button/Button";
import { HeaderTitle } from "../HeaderTitle/HeaderTitle";
import { Spinner } from "../Spinner/Spinner";

interface Props {
  title?: string;
  isLoading?: boolean;
}

export const SideBar: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  const { page, changePage } = useSideBarContext();

  return (
    <div className="flex flex-1 relative">
      {page && (
        <div
          className={
            "absolute top-1/3 flex flex-1 items-center flex-col p-6 space-y-12 bg-black-dark rounded-3xl shadow-right shadow-bottom ml-8"
          }
        >
          <Button
            variant="icon"
            onClick={() => changePage(EnumRoutes.PROFIL)}
            className={
              page === EnumRoutes.PROFIL &&
              "bg-purple-shiny p-2 rounded-2xl items-center"
            }
            color="active"
            disabled={page === EnumRoutes.PROFIL}
          >
            <IconProfil className="w-7 h-7" />
          </Button>
          <Button
            variant="icon"
            onClick={() => {
              changePage(EnumRoutes.CHAT);
              console.log("$$passss", page, changePage(EnumRoutes.CHAT));
            }}
            className={
              page === EnumRoutes.CHAT &&
              "bg-purple-shiny p-2 rounded-2xl items-center"
            }
            color="active"
            disabled={page === EnumRoutes.CHAT}
          >
            <IconMessage className="w-7 h-7" />
          </Button>
          <Button
            variant="icon"
            onClick={() => changePage(EnumRoutes.GAME)}
            className={
              page === EnumRoutes.GAME &&
              "bg-purple-shiny p-2 rounded-2xl items-center"
            }
            color="active"
            disabled={page === EnumRoutes.GAME}
          >
            <IconGame className="w-7 h-7" />
          </Button>
          <Button
            variant="icon"
            onClick={() => {
              Cookies.remove(CookieKeys.ACCESS_TOKEN);
              changePage(EnumRoutes.LOGIN);
            }}
            color="active"
          >
            <IconEnter className="w-7 h-7" />
          </Button>
          ;
        </div>
      )}
      {children}
    </div>
  );
};
