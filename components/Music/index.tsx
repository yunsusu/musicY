import Image from "next/image";
import style from "./Music.module.scss";
import { useAtom } from "jotai";
import { songChoice } from "@/lib/atoms/atoms";

export default function Music({ song }: any) {
  const [, setChangeMusic] = useAtom(songChoice);

  const handleChangeMusic = () => {
    setChangeMusic(song.uri);
  };
  return (
    <div className={style.musicWrap}>
      <div className={style.imgName}>
        <div className={style.musicImg}>
          <Image
            src={song.album.images[1].url}
            alt="노래 썸네일"
            fill
            sizes="40px"
          />
        </div>
        <div className={style.artist}>
          <div>{song.name}</div>
          <div className={style.artistName}>{song.artists[0].name}</div>
        </div>
        <div className={style.play} onClick={handleChangeMusic}>
          <div className={style.controlImg}>
            <Image
              src="https://cdn.hugeicons.com/icons/play-solid-standard.svg"
              alt="play"
              fill
              sizes="15px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
