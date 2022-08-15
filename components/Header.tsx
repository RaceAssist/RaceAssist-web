/// <reference types="styled-jsx" />
import Link from "next/link";
import Image from "next/image";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { css } from '@emotion/css'

function Header() {
  return (
    <div>
      <header>
        <menu style={linkBox}>
          <Link href="/calender">
            <a className={linkBoxStyle}>日程</a>
          </Link>
          <Link href="/card">
            <a className={linkBoxStyle}>出走馬</a>
          </Link>
          <Link href="/odds">
            <a className={linkBoxStyle}>オッズ</a>
          </Link>
          <Link href="/result">
            <a className={linkBoxStyle}>レース結果</a>
          </Link>
          <Link href="/refund">
            <a className={linkBoxStyle}>払戻金</a>
          </Link>
          <Link href="/jockey">
            <a className={linkBoxStyle}>騎手データ</a>
          </Link>
          <Link href="/horse">
            <a className={linkBoxStyle}>競走馬</a>
          </Link>
        </menu>
      </header>
    </div>
  );
}

const linkBoxStyle = css({
  flexBasis: `9%`,
  textAlign: `center`,
  padding: `10px`,
  fontSize: `15px`,
  fontFamily: ['Noto Sans JP', 'sans-serif'],
});

const linkBox = {
  display: "flex",
  marginBottom: "50px",
  justifyContent: "right",
};

export default Header;
