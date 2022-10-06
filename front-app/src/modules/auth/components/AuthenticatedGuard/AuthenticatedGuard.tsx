import { useAppContextState } from "modules/common/context/AppContext";
import { EnumRoutes } from "modules/common/routes";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";

export const AuthenticatedGuard: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();

  const { accessToken, doubleFaEnabled } = useAppContextState();
  // const { page, changePage } = useSideBarContext();

  useEffect(() => {
    if (!accessToken && !doubleFaEnabled) {
      router.pathname !== EnumRoutes.LOGIN && router.replace(EnumRoutes.LOGIN);
    } else if (
      router.pathname === "/connexion" &&
      router.query["2faEnabled"] === "false"
    ) {
      router.replace(EnumRoutes.PROFIL);
    }
  }, [accessToken, router, doubleFaEnabled]);

  return <>{children}</>;
};
