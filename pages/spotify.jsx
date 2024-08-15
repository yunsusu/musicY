import { access } from "@/lib/atoms/atoms";
import { useAtom } from "jotai";
import { useEffect } from "react";

const SpotifyAuth = () => {
  const [, setAccess] = useAtom(access);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.origin; // 현재 URL의 origin 사용 (로컬/배포 모두 대응)
      const clientId = "9cd43e0a85eb4c29bbd4900fddb31c8f";
      const redirectUri = currentUrl; // 현재 origin을 redirect URI로 사용
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

      // 해시에서 액세스 토큰 추출
      const hash = window.location.hash;
      const accessToken = new URLSearchParams(hash.substring(1)).get(
        "access_token"
      );

      if (!accessToken) {
        // 토큰이 없으면 인증 페이지로 리다이렉트
        window.location.href = authUrl;
      } else {
        // 토큰이 있으면 상태로 설정
        setAccess(accessToken);

        // 만료 확인 및 갱신 로직 추가 (옵션)
        // 예: 액세스 토큰의 만료 시간 등을 확인하고 만료되었으면 새로 갱신하는 로직을 여기에 추가
      }
    }
  }, []);

  return <></>;
};

export default SpotifyAuth;
