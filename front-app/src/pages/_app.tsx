import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticatedGuard } from "modules/auth/components/AuthenticatedGuard/AuthenticatedGuard";
import { AppContextProvider } from "modules/common/context/AppContext";
import "styles/index.css";
require("typeface-dm-sans");

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AppContextProvider>
        <QueryClientProvider client={queryClient}>
          <AuthenticatedGuard>
            <Component {...pageProps} />
          </AuthenticatedGuard>
        </QueryClientProvider>
      </AppContextProvider>
    </div>
  );
}

export default MyApp;
