import { useRouter } from "next/router";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { EnumRoutes } from "../routes";

interface SideBarContext {
  page?: EnumRoutes;
  changePage?: (url: EnumRoutes) => void;
}

const SideBarContext = createContext<SideBarContext>(null);

const SideBarContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [page, setPage] = useState(EnumRoutes.PROFIL);

  useEffect(() => {
    if (router.pathname !== EnumRoutes.LOGIN)
      setPage(router.pathname as EnumRoutes);
    else setPage(null);
  }, [router]);
  console.log("$$passss");

  const changePage = (url: EnumRoutes) => {
    console.log("$$passss", url);
    setPage(url);
    router.push(url);
  };

  return (
    <SideBarContext.Provider value={{ changePage, page }}>
      {children}
    </SideBarContext.Provider>
  );
};

function useSideBarContext() {
  const context = useContext(SideBarContext);
  if (context === undefined) {
    throw new Error(
      "useSideBarContextState must be used within a SideBarContextProvider"
    );
  }
  return context;
}
export { SideBarContextProvider, useSideBarContext };
