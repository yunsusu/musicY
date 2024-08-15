import { instance } from "./axios";
const key = process.env.NEXT_PUBLIC_API_KEY;

export const search1 = async () => {
  try {
    const result = await instance.get(
      `/2.0/?method=track.search&track=Believe&api_key=${key}&format=json`
    );
    return result.data.results.trackmatches.track;
  } catch (error) {
    console.error(error);
  }
};
export const topArtist = async () => {
  try {
    const result = await instance.get(
      `/2.0/?method=chart.gettopartists&api_key=${key}&format=json`
    );
    return result.data.artists.artist;
  } catch (error) {
    console.error(error);
  }
};
export const topTracks = async () => {
  try {
    const result = await instance.get(
      `/2.0/?method=chart.gettoptracks&api_key=${key}&format=json `
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const searchSong = async (trackName: string) => {
  try {
    const response = await instance.get("https://ws.audioscrobbler.com/2.0/", {
      params: {
        method: "track.search",
        track: trackName,
        api_key: key,
        format: "json",
      },
    });

    // console.log(response);
    return response.data.results.trackmatches.track;
  } catch (error) {
    console.error("Error fetching song data:", error);
  }
};
