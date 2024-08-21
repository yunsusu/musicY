import { instance2 } from "./axios";

export const playSong = async (
  deviceId: string | null,
  accessToken: string,
  changeMusic: string = "spotify:track:7FbrGaHYVDmfr7KoLIZnQ7"
) => {
  if (!deviceId) {
    console.error("Device ID is null. Cannot play the song.");
    return;
  }

  try {
    await instance2.put(
      `/v1/me/player/play?device_id=${deviceId}`,
      {
        uris: [changeMusic], // 뉴진스 - Ditto 트랙 ID
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error playing song:", error);
  }
};

export const pauseSong = async (
  deviceId: string | null,
  accessToken: string
) => {
  if (!deviceId) {
    console.error("Device ID is null. Cannot pause the song.");
    return;
  }

  console.log(`Pausing song on device: ${deviceId}`);

  try {
    await instance2.put(
      `/v1/me/player/pause?device_id=${deviceId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error pausing song:", error);
  }
};

export const playListMore = async (accessToken: string, more: any) => {
  try {
    const res = await instance2.post(
      `/v1/me/player/queue?uri=${more}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const playerSkip = async (PN: string, accessToken: string) => {
  try {
    const res = await instance2.post(
      `/v1/me/player/${PN}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};
