import { useAppContextState } from "modules/common/context/AppContext";
import { EnumRoutes } from "modules/common/routes";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";

export const AuthenticatedGuard: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();

  const { accessToken, doubleFaEnabled } = useAppContextState();

  useEffect(() => {
    if (!accessToken && !doubleFaEnabled) {
      router.replace(EnumRoutes.LOGIN);
    }
  }, [accessToken, router, doubleFaEnabled]);

  return <>{children}</>;
};
