import { access } from "@/lib/atoms/atoms";
import { useAtom } from "jotai";
import { useEffect } from "react";

const SpotifyAuth = () => {
  const [accessT, setAccess] = useAtom(access); // atomWithStorage로 관리된 상태

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.origin; // 현재 URL의 origin 사용
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

      if (accessToken) {
        // 토큰이 있으면 상태로 설정 (atomWithStorage 사용으로 자동으로 로컬 스토리지에 저장됨)
        setAccess(accessToken);

        // URL 해시 제거
        window.location.hash = "";
      } else if (!accessT) {
        // 로컬 스토리지에도 토큰이 없으면 인증 페이지로 리다이렉트
        window.location.href = authUrl;
      }
    }
  }, [accessT, setAccess]);

  return <></>; // UI는 필요 없으므로 빈 반환
};

export default SpotifyAuth;
