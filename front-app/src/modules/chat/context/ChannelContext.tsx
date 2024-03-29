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

interface ChannelContext {
  chatName?: Channel;
  changeChatName?: (channel: Channel) => void;
}

const ChannelContext = createContext<ChannelContext>(null);

const ChannelContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [chatName, setChannel] = useState<Channel>({
    id: 0,
    name: undefined,
    private: false,
    user: false,
    admin: false,
    owner: false,
    password: false,
  });

  const changeChatName = (channel: Channel) => {
    setChannel(channel);
  };

  return (
    <ChannelContext.Provider value={{ changeChatName, chatName }}>
      {children}
    </ChannelContext.Provider>
  );
};

function useChannelContext() {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error(
      "useChannelContextState must be used within a ChannelContextProvider"
    );
  }
  return context;
}
export { ChannelContextProvider, useChannelContext };
