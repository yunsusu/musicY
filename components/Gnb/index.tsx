import Link from "next/link";
import style from "./gnb.module.scss";

export default function Gnb() {
  return (
    <div className={style.gnbWrap}>
      <Link href={"/"} className={style.gnbLogo}>
        MUSICY
      </Link>

      <div className={style.gnbSearch}>검색</div>
    </div>
  );
}
