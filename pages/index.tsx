import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import style from "./main.module.scss";
import { useAtom } from "jotai";
import { access, device, songChoice } from "@/lib/atoms/atoms";
import { getCategories, getCategories2 } from "@/lib/apis/spotify/chart";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [accessToken] = useAtom(access);
  const [, setChangeMusic] = useAtom(songChoice);

  // const handleChangeMusic = (item: string | ((prev: string) => string)) => {
  //   setChangeMusic(item);
  // };

  // const { data: getCategory } = useQuery({
  //   queryKey: ["category"],
  //   queryFn: () => getCategories(accessToken),
  //   enabled: !!accessToken,
  //   staleTime: 60 * 1000,
  // });
  const { data: getCategory2 } = useQuery({
    queryKey: ["category2"],
    queryFn: () => getCategories2(accessToken),
    enabled: !!accessToken,
    staleTime: 60 * 1000,
  });
  return (
    <>
      <Head>
        <title>musicY</title>
      </Head>
      <div className={style.mainWrap}>
        <div>추천 재생목록</div>
        <div className={style.categories}>
          {/* {getCategory?.categories.items.map((item: any, index: number) => (
            <Link
              href={`/category/${item.id}`}
              key={index}
              className={style.category}
            >
              <h2>{item.name}</h2>
              <div className={style.categoryImg}>
                <Image src={item.icons[0].url} alt="icon" fill sizes="150px" />
              </div>
              <p>{item.description}</p>
            </Link>
          ))} */}
        </div>
        <div>
          <div className={style.categories}>
            {getCategory2?.playlists.items.map((item: any, index: number) => (
              <Link
                href={`/category/${item.id}`}
                key={index}
                // onClick={() => handleChangeMusic(item.uri)}
                className={style.category}
              >
                <div className={style.categoryImg}>
                  <Image
                    src={item.images[0].url}
                    alt="playlist"
                    fill
                    sizes="150px"
                  />

                  <div className={style.playlistTitle}>{item.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
