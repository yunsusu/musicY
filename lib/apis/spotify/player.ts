import { instance2 } from "./axios";

export const playSong = async (
  deviceId: string | null,
  accessToken: string
) => {
  if (!deviceId) {
    console.error("Device ID is null. Cannot play the song.");
    return;
  }

  console.log(`Playing song on device: ${deviceId}`);

  try {
    await instance2.put(
      `/v1/me/player/play?device_id=${deviceId}`,
      {
        uris: ["spotify:track:7FbrGaHYVDmfr7KoLIZnQ7"], // 뉴진스 - Ditto 트랙 ID
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
