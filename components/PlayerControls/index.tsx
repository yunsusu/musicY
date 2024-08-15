import { useState, useEffect } from "react";
import styles from "./PlayerControls.module.scss";
import { useMutation } from "@tanstack/react-query";
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
  const [player, setPlayer] = useState<any>(null);
  const [progress, setProgress] = useState(0); // 진행도를 저장할 상태
  const [trackDuration, setTrackDuration] = useState(0); // 트랙의 총 길이
  const [trackPosition, setTrackPosition] = useState(0); // 현재 트랙의 진행 시간
  const [track, setTrack] = useState<any>(null); // 현재 재생 중인 트랙 정보

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("Spotify Web Playback SDK is ready");

      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb: (arg0: string) => void) => {
          cb(
            //access token goes here
            "BQBxL-n90yCq1C5-58H00RkC4_USJbP4k76gcUUHCTcQm6ZM9YUiVMOJ2399LFPmwHzi7ZETAUs9bU98q3c4wGA5rHxZ7-TYSERfNUdunRrFCSwPxXMutj509SY5r6RUY_pIyTb-8hSGfRHcCf-y69UryIwJEsTaSJerYySJdOCNJUNnXT2yW7MFIauLWkPqFJNUY350QaAzUg0AJBQrR2rvVZvqecjDiJnvnK5IVzN-iQ"
          );
        },
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }: any) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setPlayer(player); // 플레이어 상태 저장
      });

      player.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state: any) => {
        if (state) {
          setIsPlaying(!state.paused); // 재생 상태 업데이트
          setTrack(state.track_window.current_track); // 현재 트랙 정보 설정
          setTrackDuration(state.duration); // 트랙의 총 길이 설정
          setTrackPosition(state.position); // 현재 진행 시간 설정

          // 트랙 진행도를 백분율로 계산
          const progressPercentage = (state.position / state.duration) * 100;
          setProgress(progressPercentage);
        }
      });

      player.connect().then((success: any) => {
        if (success) {
          console.log("The player has connected successfully");
        } else {
          console.error("Failed to connect the player");
        }
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [accessToken]);

  const { mutate: playMusic } = useMutation({
    mutationFn: () => playSong(deviceId, accessToken),
    onSuccess: () => {
      setIsPlaying(true);
    },
    onError: (error) => {
      console.error("Error playing song:", error);
    },
  });

  const { mutate: pauseMusic } = useMutation({
    mutationFn: () => pauseSong(deviceId, accessToken),
    onSuccess: () => {
      setIsPlaying(false);
    },
    onError: (error) => {
      console.error("Error pausing song:", error);
    },
  });

  const handleMusic = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  return (
    <div className={styles.playerControls}>
      <div className={styles.trackInfo}>
        {track ? (
          <>
            <img src={track.album.images[0].url} alt={track.name} />
            <div className={styles.trackDetails}>
              <p className={styles.trackName}>{track.name}</p>
              <p className={styles.trackArtist}>{track.artists[0].name}</p>
            </div>
          </>
        ) : (
          <p>Loading track...</p>
        )}
      </div>

      <div className={styles.controls}>
        <button className={styles.controlButton} onClick={handleMusic}>
          {deviceId && isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PlayerControls;
