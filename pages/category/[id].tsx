import Head from "next/head";
import style from "./style.module.scss";
import { useAtom } from "jotai";
import { access, songChoice } from "@/lib/atoms/atoms";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getPlayList } from "@/lib/apis/spotify/playlists";
import Image from "next/image";

export default function Home() {
  const [accessToken] = useAtom(access);
  const [, setChangeMusic] = useAtom(songChoice);

  const handleChangeMusic = (item: string | ((prev: string) => string)) => {
    setChangeMusic(item);
  };

  const router = useRouter();
  const { id } = router.query;

  const { data: playlist } = useQuery({
    queryKey: ["playlist", id],
    queryFn: () => getPlayList(id, accessToken),
    enabled: !!id && !!accessToken,
  });
  return (
    <>
      <Head>
        <title>musicY</title>
      </Head>
      <div className={style.mainWrap}>
        {playlist?.items.map((item: any, index: number) => (
          <div key={index} className={style.categoryItem}>
            <div className={style.categoryImg}>
              <Image
                src={item.track.album.images[0].url}
                alt={item.track.name}
                fill
                sizes="150px"
              />
            </div>
            <div className={style.categoryTitle}>
              {item.track.name} - {item.track.artists[0].name}
            </div>
            <div
              className={style.play}
              onClick={() => handleChangeMusic(item.track.uri)}
            >
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
        ))}
      </div>
    </>
  );
}
