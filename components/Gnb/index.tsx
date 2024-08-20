import Link from "next/link";
import style from "./gnb.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

export default function Gnb() {
  return (
    <div className={style.gnbWrap}>
      <Link href={"/"} className={style.gnbLogo}>
        MUSICY
      </Link>

      <Link href={"/search"} className={`${style.gnbSearch} ${style.gnbItem}`}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </Link>
      <Link href={"/chart"} className={`${style.gnbChart} ${style.gnbItem}`}>
        <FontAwesomeIcon icon={faChartSimple} />
      </Link>
    </div>
  );
}
