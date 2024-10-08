import { useState, useEffect, useRef } from "react";
import styles from "./PlayerControls.module.scss";
import { useMutation } from "@tanstack/react-query";
import { pauseSong, playSong, playerSkip } from "@/lib/apis/spotify/player";
import { useAtom } from "jotai";
import { access, device, songChoice } from "@/lib/atoms/atoms";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

const PlayerControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useAtom(device);
  const [player, setPlayer] = useState<any>(null);
  const [progress, setProgress] = useState(0); // 진행도를 저장할 상태
  const [trackDuration, setTrackDuration] = useState(0); // 트랙의 총 길이
  const [trackPosition, setTrackPosition] = useState(0); // 현재 트랙의 진행 시간
  const [track, setTrack] = useState<any>(null); // 현재 재생 중인 트랙 정보
  const [token, setToken] = useAtom(access);
  const [changeMusic] = useAtom(songChoice);
  const [pausedPosition, setPausedPosition] = useState(0); // 일시정지 시점 저장
  const [titleFlow, setTitleFlow] = useState<number>(0);

  // 실시간 progress 업데이트
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && player) {
      interval = setInterval(() => {
        player.getCurrentState().then((state: any) => {
          if (state) {
            setTrackPosition(state.position);
            const progressPercentage = (state.position / state.duration) * 100;
            setProgress(progressPercentage);
          }
        });
      }, 1000); // 1초마다 업데이트
    } else if (!isPlaying && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, player]);

  // ProgressBar 클릭 시 해당 위치로 이동
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player || !trackDuration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercentage = clickX / rect.width;
    const newPosition = clickPercentage * trackDuration;

    player.seek(newPosition); // 해당 위치로 이동
  };

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
          cb(token);
        },
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }: any) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setPlayer(player);
      });

      player.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state: any) => {
        if (state) {
          setIsPlaying(!state.paused);
          setTrack(state.track_window.current_track);
          setTrackDuration(state.duration);
          setTrackPosition(state.position);

          if (state.paused) {
            setPausedPosition(state.position);
          }

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
  }, [token]);

  const { mutate: playMusic } = useMutation({
    mutationFn: () => playSong(deviceId, token, changeMusic),
    onSuccess: () => {
      setIsPlaying(true);
    },
    onError: (error) => {
      console.error("Error playing song:", error);
    },
  });

  const { mutate: pauseMusic } = useMutation({
    mutationFn: () => pauseSong(deviceId, token),
    onSuccess: () => {
      setIsPlaying(false);
    },
    onError: (error) => {
      console.error("Error pausing song:", error);
    },
  });
  const { mutate: playSkip } = useMutation({
    mutationFn: (PN: string) => playerSkip(PN, token),
    onSuccess: () => {
      setIsPlaying(false);
    },
    onError: (error) => {
      console.error("Error pausing song:", error);
    },
  });

  useEffect(() => {
    playMusic();
  }, [changeMusic]);

  const handleMusic = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      if (player && pausedPosition > 0) {
        player.seek(pausedPosition).then(() => {
          player.resume();
        });
      } else {
        playMusic();
      }
    }
  };
  const containerRef = useRef<HTMLDivElement>(null); // 트랙 이름을 감싸는 부모 요소 참조
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleFlow((prev) => {
        const trackWidth = trackRef.current?.offsetWidth || 0;
        const containerWidth = containerRef.current?.offsetWidth || 0;

        // 텍스트가 부모 컨테이너보다 길 때만 이동
        if (trackWidth > containerWidth) {
          // 텍스트가 다 지나갔다면 다시 0으로 리셋
          if (prev >= containerWidth + 30) {
            return 0;
          }
          return prev + 1;
        } else {
          return 0; // 텍스트가 짧으면 움직이지 않게 유지
        }
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    track && (
      <div className={styles.playerControls}>
        <div className={styles.trackInfo}>
          <>
            <img src={track.album.images[0].url} alt={track.name} />
            <div className={styles.trackDetails}>
              <div className={styles.trackName} ref={containerRef}>
                <div
                  style={{ transform: `translateX(-${titleFlow}px)` }}
                  ref={trackRef}
                >
                  {track.name}
                </div>
              </div>
              <p className={styles.trackArtist}>{track.artists[0].name}</p>
            </div>
          </>
        </div>

        <div className={styles.controls}>
          <div className={styles.controlsWrap}>
            <button
              className={styles.controlPrev}
              onClick={() => playSkip("previous")}
            >
              <FontAwesomeIcon icon={faBackward} />
            </button>
            <button className={styles.controlButton} onClick={handleMusic}>
              {deviceId && isPlaying ? (
                <div className={styles.controlImg}>
                  <Image
                    src="https://cdn.hugeicons.com/icons/pause-solid-standard.svg"
                    alt="pause"
                    fill
                    sizes="30px"
                  />
                </div>
              ) : (
                <div className={styles.controlImg}>
                  <Image
                    src="https://cdn.hugeicons.com/icons/play-solid-standard.svg"
                    alt="play"
                    fill
                    sizes="30px"
                  />
                </div>
              )}
            </button>
            <button
              className={styles.controlNext}
              onClick={() => playSkip("next")}
            >
              <FontAwesomeIcon icon={faForward} />
            </button>
          </div>
          <div className={styles.progressBar} onClick={handleProgressClick}>
            <div
              className={styles.progress}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    )
  );
};

export default PlayerControls;
