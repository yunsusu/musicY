import Image from "next/image";
import style from "./Music.module.scss";

interface Music {
  artist: string;
  image: string[];
  listeners: string;
  mbid: string;
  name: string;
  streamable: string;
  url: string;
}

export default function Music({ artists }: any) {
  console.log(artists);
  return (
    <div className={style.musicWrap}>
      <div className={style.musicImg}>
        <Image src={artists.image[2]["#text"]} alt="노래 썸네일" fill />
      </div>
      <div>{artists.artist}</div>
    </div>
  );
}
