import { instance2 } from "./axios";

export const getPlayList = async (id: any, accessToken: any) => {
  try {
    const res = await instance2.get(`/v1/playlists/${id}/tracks?market=KR`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
