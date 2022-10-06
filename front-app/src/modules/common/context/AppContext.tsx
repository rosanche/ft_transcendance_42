import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useReducer,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { CookieKeys } from "../types";

interface AppContext {
  accessToken?: string;
  doubleFaEnabled?: string;
}

const accessToken = Cookies.get(CookieKeys.ACCESS_TOKEN);

const defaultContext: AppContext = {
  accessToken: accessToken,
};

type Action = {
  type: "set";
  payload: Partial<AppContext>;
};

type Dispatch = (action: Action, asyncFn?: () => Promise<any>) => Promise<any>;

const AppStateContext = createContext<AppContext>(defaultContext);
const AppDispatchContext = createContext<Dispatch | undefined>(undefined);

function AppContextReducer(state: AppContext, action: Action): AppContext {
  switch (action.type) {
    case "set": {
      return { ...state, ...action.payload };
    }
  }
}

const AppContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const [state, dispatch] = useReducer(AppContextReducer, {
    ...defaultContext,
    doubleFaEnabled: router.query["2faEnabled"] as string,
  });

  const dispatchAsync = useCallback(
    async (action: Action, asyncFn?: () => Promise<any>) => {
      dispatch(action);
      return asyncFn && asyncFn();
    },
    []
  );

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatchAsync}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

function useAppContextState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error(
      "useAppContextState must be used within a AppContextProvider"
    );
  }
  return context;
}
function useAppContextDispatch() {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useAppContextDispatch must be used within a AppContextProvider"
    );
  }
  return context;
}

export { AppContextProvider, useAppContextState, useAppContextDispatch };
