/// <reference types="styled-jsx" />
import Link from "next/link";
import { css } from "@emotion/css";
import Image from "next/image";
import logoImg from "../public/RaceAssist.svg";

function Header() {
    return (
        <header className={header}>
            <Link href="/">
                <a>
                    <Image
                        className={logo}
                        src="/RaceAssist.svg"
                        width="195"
                        height="26"
                        alt="logo"
                    />
                </a>
            </Link>
            <div className={linkBox}>
                <Link href="/schedule">
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
                <Link href="/login">
                    <a className={LoginBoxStyle}>ログイン</a>
                </Link>
            </div>
        </header>
    );
}

const logo = css({
    marginLeft: "10px",
});

const linkBoxStyle = css({
    flexBasis: "10%",
    textAlign: "center",
    padding: "25px",
    fontSize: "17px",
});

const LoginBoxStyle = css({
    flexBasis: "9%",
    textAlign: "center",
    paddingLeft: "25px",
    paddingRight: "25px",
    paddingTop: "10px",
    paddingBottom: "10px",
    marginLeft: "30px",
    marginRight: "50px",
    color: "#ffffff",
    borderRadius: "10px",
    fontSize: "17px",
    background: "#0066ff",
});

const header = css({
    display: "flex",
    marginTop: "25px",
    marginBottom: "25px",
});

const linkBox = css({
    marginLeft: "auto",
});

export default Header;
