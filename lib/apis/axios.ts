import axios from "axios";

export const instance = axios.create({
  baseURL: "https://ws.audioscrobbler.com/",
});
