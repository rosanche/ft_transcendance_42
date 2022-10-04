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

type Channel = {
  id: number;
  name: string;
  private: boolean;
  user: boolean;
  admin: boolean;
  owner: boolean;
  password: boolean;
};

interface ModeChannelMpContext {
  cha_mp?: string;
  changeCha_mp?: (cha_mp: string) => void;
}

const ModeChannelMpContext = createContext<ModeChannelMpContext>(null);

const ModeChannelMpContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [cha_mp, setCha_mp] = useState<string>("default");

  console.log("$$passss");

  const changeCha_mp = (src: string) => {
    console.log("$$passss", src);
    setCha_mp(src);
  };

  return (
    <ModeChannelMpContext.Provider value={{ changeCha_mp, cha_mp }}>
      {children}
    </ModeChannelMpContext.Provider>
  );
};

function useModeChannelMpContext() {
  const context = useContext(ModeChannelMpContext);
  if (context === undefined) {
    throw new Error(
      "useModeChannelMpContextState must be used within a ModeChannelMpContextProvider"
    );
  }
  return context;
}
export { ModeChannelMpContextProvider, useModeChannelMpContext };
