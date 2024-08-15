import { instance2 } from "./axios";

export const searchSong = async (searchWord: string, token: string | null) => {
  try {
    const res = await instance2.get("/v1/search", {
      params: {
        q: searchWord,
        type: "track",
        limit: 8, // 원하는 트랙 개수 설정
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data.tracks.items;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to search song");
  }
};
