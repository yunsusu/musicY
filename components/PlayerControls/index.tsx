import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./PlayerControls.module.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import { pauseSong, playSong } from "@/lib/apis/spotify/player";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

const PlayerControls = ({ accessToken }: { accessToken: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      initializePlayer();
    };

    const initializePlayer = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb: (arg0: string) => void) => {
            cb(accessToken);
          },
          volume: 0.5,
        });

        player.addListener("ready", ({ device_id }: any) => {
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);
        });

        player.addListener("not_ready", ({ device_id }: any) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("player_state_changed", (state: any) => {
          console.log("Player state changed:", state);
        });

        player.connect();
      };
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [accessToken]);

  const { mutate: playMusic } = useMutation({
    mutationFn: () => playSong(deviceId, accessToken), // 함수를 참조로 전달
    onSuccess: () => {
      setIsPlaying(true);
    },
    onError: (error) => {
      console.error("Error playing song:", error);
    },
  });

  const { mutate: pauseMusic } = useMutation({
    mutationFn: () => pauseSong(deviceId, accessToken), // 함수를 참조로 전달
    onSuccess: () => {
      setIsPlaying(false);
    },
    onError: (error) => {
      console.error("Error pausing song:", error);
    },
  });

  const handleMusic = () => {
    isPlaying ? pauseMusic : playMusic;
  };

  return (
    <div className={styles.playerControls}>
      <button
        className={`${styles.controlButton} ${
          isPlaying ? styles.pause : styles.play
        }`}
        onClick={handleMusic}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      {!deviceId && <p className={styles.loadingMessage}>Loading player...</p>}
    </div>
  );
};

export default PlayerControls;
