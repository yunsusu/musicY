import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Head from "next/head";
import Gnb from "@/components/Gnb";
import { useAtom } from "jotai";
import { access } from "@/lib/atoms/atoms";
import PlayerControls from "@/components/PlayerControls";
import SpotifyAuth from "./spotify";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  const [token, setToken] = useAtom(access);
  return (
    <>
      <Head>
        <title>musicY</title>
        <meta name="description" content="musicY!" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Gnb />
        <SpotifyAuth />
        {token && <PlayerControls />}
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
