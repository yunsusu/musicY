import Head from "next/head";
import Music from "@/components/Music";
import SpotifyAuth from "./spotify";
import { useState } from "react";
import PlayerControls from "@/components/PlayerControls";
import { useQuery } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { searchSong } from "@/lib/apis/spotify/search";
import style from "./main.module.scss";
import { useAtom } from "jotai";
import { access } from "@/lib/atoms/atoms";

type Inputs = {
  songName: string;
};
export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) =>
    setSongSearch(data.songName);

  const [accessToken, setAccessToken] = useAtom(access);
  const [songSearch, setSongSearch] = useState("j.clef");

  const { data: song } = useQuery({
    queryKey: ["song", songSearch],
    queryFn: () => searchSong(songSearch, accessToken),
  });
  console.log(song);
  return (
    <>
      <Head>
        <title>musicY</title>
      </Head>
      <div className={style.mainWrap}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="노래, 아티스트 이름 검색"
            {...register("songName")}
          />
          <button type="submit">검색</button>
        </form>
        <div className={style.musicWrap}>
          {song?.map((item: any, index: any) => (
            <Music key={index} song={item} />
          ))}
        </div>
      </div>
    </>
  );
}
