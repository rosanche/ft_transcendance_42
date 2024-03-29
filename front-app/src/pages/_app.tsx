import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticatedGuard } from "modules/auth/components/AuthenticatedGuard/AuthenticatedGuard";
import { AppContextProvider } from "modules/common/context/AppContext";
import { ModalProvider } from "react-modal-hook";
import ReactModal from "react-modal";
import { TransitionGroup } from "react-transition-group";
import "styles/index.css";
import { SocketContextProvider } from "modules/common/context/SocketContext";
import { SideBar } from "modules/common/components/_ui/SideBar/SideBar";
import { SideBarContextProvider } from "modules/common/context/SideBarContext";
import { ChannelContextProvider } from "modules/chat/context/ChannelContext";
import { ModeChannelMpContextProvider } from "modules/chat/context/ModeChannelMpContext";
import { UsersChannelContextProvider } from "modules/chat/context/UsersChannelContext";
import { SocketGameContextProvider } from "modules/common/context/SocketGameContext";

require("typeface-dm-sans");

const queryClient = new QueryClient();

ReactModal.setAppElement("#__next");

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          
          <SocketContextProvider>
          <SocketGameContextProvider>
          <ChannelContextProvider>
          <ModeChannelMpContextProvider>
          <UsersChannelContextProvider>
            <ModalProvider rootComponent={TransitionGroup}>
              <SideBarContextProvider>
                <AuthenticatedGuard>
                  <SideBar>
                    <Component {...pageProps} />
                  </SideBar>
                </AuthenticatedGuard>
              </SideBarContextProvider>
            </ModalProvider>
            </UsersChannelContextProvider>
          </ModeChannelMpContextProvider>
          </ChannelContextProvider>
          </SocketGameContextProvider>
          </SocketContextProvider>
        </AppContextProvider>
      </QueryClientProvider>
    </div>
  );
}

export default MyApp;
