/// <reference types="styled-jsx" />
import Link from "next/link";
import { css } from "@emotion/css";
import Image from "next/image";
import jwt_decode from "jwt-decode";
import nookies from "nookies";
import { useEffect, useState } from "react";

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
                <LoginStatus />
            </div>
        </header>
    );
}

function LoginStatus() {
    const [token, setToken] = useState<string | null | undefined>(null);
    useEffect(() => {
        const cookie = nookies.get()["token"];
        setToken(cookie);
    }, []);
    console.log(token);
    if (token === null || token === undefined) {
        return (
            <Link href="/login">
                <a className={LoginBoxStyle}>ログイン</a>
            </Link>
        );
    } else {
        return (
            <PlayerHead token={token} />
        );
    }
}

function PlayerHead(props: { token: string }) {
    const decoded = jwt_decode(props.token) as Token;
    return (
        <Link href="/my-page">
            <a className={headStyle}>
                <Image
                    src={
                        "https://crafthead.net/avatar/" +
                        decoded.uuid +
                        "/64.png"
                    }
                    width="48"
                    height="48"
                    alt="logo"
                />
            </a>
        </Link>
    );
}

type Token = {
    username: string;
    uuid: string;
};

const headStyle = css({
    flexBasis: "9%",
});

const logo = css({
    marginLeft: "10px",
});

const linkBoxStyle = css({
    textAlign: "center",
    paddingTop: "10px",
    paddingLeft: "40px",
    paddingRight: "40px",
    fontSize: "17px",
});

const LoginBoxStyle = css({
    textAlign: "center",
    justifyContent: "center",
    paddingLeft: "25px",
    paddingRight: "25px",
    paddingBottom: "10px",
    paddingTop: "10px",
    marginLeft: "25px",
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
    display:"flex",
    marginLeft: "auto",
});

export default Header;
