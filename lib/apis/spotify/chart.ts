import { instance2 } from "./axios";

export const topTrack = async (token: string, id: any, market = "kr") => {
  try {
    const res = await instance2.get(
      `/v1/artists/${id}/top-tracks?market=${market}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 여기서 token을 사용
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getCategories = async (token: string) => {
  try {
    const res = await instance2.get(`v1/browse/categories`, {
      headers: {
        Authorization: `Bearer ${token}`, // 여기서 token을 사용
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getCategories2 = async (token: string) => {
  try {
    const res = await instance2.get(`v1/browse/featured-playlists`, {
      headers: {
        Authorization: `Bearer ${token}`, // 여기서 token을 사용
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
