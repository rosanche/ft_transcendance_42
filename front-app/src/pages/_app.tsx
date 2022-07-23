import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "styles/index.css";
require("typeface-dm-sans");

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </div>
  );
}

export default MyApp;
