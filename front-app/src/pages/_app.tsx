import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticatedGuard } from "modules/auth/components/AuthenticatedGuard/AuthenticatedGuard";
import { AppContextProvider } from "modules/common/context/AppContext";
import { ModalProvider } from "react-modal-hook";
import ReactModal from "react-modal";
import { TransitionGroup } from "react-transition-group";
import "styles/index.css";
import { SocketContextProvider } from "modules/common/context/SocketContext";
require("typeface-dm-sans");

const queryClient = new QueryClient();

ReactModal.setAppElement("#__next");

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <AuthenticatedGuard>
            <SocketContextProvider>
              <ModalProvider rootComponent={TransitionGroup}>
                <Component {...pageProps} />
              </ModalProvider>
            </SocketContextProvider>
          </AuthenticatedGuard>
        </AppContextProvider>
      </QueryClientProvider>
    </div>
  );
}

export default MyApp;
