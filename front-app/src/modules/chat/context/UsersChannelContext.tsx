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
import { users, form, pass, ban, channel } from "modules/chat/types";

interface UsersChannelContext {
  usersChannel?: users[];
  changeUsersChannel: (channel: users[]) => void;
}

const UsersChannelContext = createContext<UsersChannelContext>(null);

const UsersChannelContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [usersChannel, setUsersChannel] = useState<users>([]);

  console.log("$$passss");

  const changeChatName = (users: users[]) => {
    console.log("$$passss", users);
    setUsersChannel(users);
  };

  return (
    <UsersChannelContext.Provider value={{ changeChatName, usersChannel }}>
      {children}
    </UsersChannelContext.Provider>
  );
};

function useUsersChannelContext() {
  const context = useContext(UsersChannelContext);
  if (context === undefined) {
    throw new Error(
      "useUsersChannelContextState must be used within a UsersChannelContextProvider"
    );
  }
  return context;
}
export { UsersChannelContextProvider, useUsersChannelContext };
