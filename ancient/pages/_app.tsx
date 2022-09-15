
import { AppProps } from 'next/app'
import '../components/Canvas.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}