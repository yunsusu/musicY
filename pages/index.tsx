import Head from "next/head";
import Music from "@/components/Music";
import SpotifyAuth from "./spotify";
import { useState } from "react";
import PlayerControls from "@/components/PlayerControls";

export default function Home() {
  const [accessToken, setAccessToken] = useState(null);

  const handleAuthSuccess = (token: any) => {
    setAccessToken(token);
  };
  return (
    <>
      <Head>
        <title>musicY</title>
      </Head>
      <div className="mainWrap">
        <SpotifyAuth onAuthSuccess={handleAuthSuccess} />
        {accessToken && <PlayerControls accessToken={accessToken} />}
        {/* <Music /> */}
      </div>
    </>
  );
}
