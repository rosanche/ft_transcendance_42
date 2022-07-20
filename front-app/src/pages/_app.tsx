import "styles/index.css";
require("typeface-dm-sans");

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
