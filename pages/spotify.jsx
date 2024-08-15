import { useEffect, useState } from "react";

const clientId = "9cd43e0a85eb4c29bbd4900fddb31c8f";
const redirectUri = "http://music-y.vercel.app";
const scopes = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
  "user-read-currently-playing",
  "playlist-read-private",
  "user-library-read",
].join(" ");

const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(
  scopes
)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

const SpotifyAuth = ({ onAuthSuccess }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const accessToken = new URLSearchParams(hash.substring(1)).get(
      "access_token"
    );

    if (!accessToken) {
      window.location.href = authUrl;
    } else {
      setIsAuthenticated(true);
      onAuthSuccess(accessToken);
    }
  }, []);

  return <></>;
};

export default SpotifyAuth;
