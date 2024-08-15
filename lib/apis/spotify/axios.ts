import axios from "axios";

export const instance2 = axios.create({
  baseURL: "https://api.spotify.com",
});
