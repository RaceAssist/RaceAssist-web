import Link from "next/link";
import { css } from "@emotion/css";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import nookies from "nookies";
import React, { useEffect, useState } from "react";

import { styled } from "@mui/system";
import { useColorScheme } from "@mui/material/styles";
import { useAtom } from "jotai";
import { themeAtom } from "../src/themeSlice";
import { Switch } from "@mui/material";

function Header() {
    const [theme, setTheme] = useAtom(themeAtom);
    const [checked, setChecked] = React.useState(theme === "dark");
    const { mode, setMode } = useColorScheme();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setTheme("dark");
            setMode("dark");
        } else {
            setTheme("light");
            setMode("light");
        }
        setChecked(event.target.checked);
    };
    const label = { inputProps: { "aria-label": "change page theme" } };
    return (
        <header className={header}>
            <Link href="/" legacyBehavior>
                <a className={logo}>
                    <Image src="/RaceAssist.svg" width="195" height="26" alt="logo" />
                </a>
            </Link>
            <div className={linkBox}>
                <MaterialUISwitch
                    {...label}
                    className={toggleSwitch}
                    checked={checked}
                    onChange={handleChange}
                />
                <Link href="/schedule" legacyBehavior>
                    <a className={linkBoxStyle}>日程</a>
                </Link>
                <Link href="/card" legacyBehavior>
                    <a className={linkBoxStyle}>出走馬</a>
                </Link>
                <Link href="/race" legacyBehavior>
                    <a className={linkBoxStyle}>レース</a>
                </Link>
                <Link href="/place" legacyBehavior>
                    <a className={linkBoxStyle}>競技場</a>
                </Link>
                <Link href="/result" legacyBehavior>
                    <a className={linkBoxStyle}>レース結果</a>
                </Link>
                <Link href="/jockey" legacyBehavior>
                    <a className={linkBoxStyle}>騎手データ</a>
                </Link>
                <Link href="/horse" legacyBehavior>
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
    if (token === null || token === undefined) {
        return (
            <Link href="/login" legacyBehavior>
                <div className={LoginBoxStyle}>ログイン</div>
            </Link>
        );
    } else {
        return <PlayerHead token={token} />;
    }
}

function PlayerHead(props: { token: string }) {
    const decoded = jwtDecode(props.token) as Token;
    return (
        <Link href="/my-page" legacyBehavior>
            <div className={headStyle}>
                <Image
                    className={headImage}
                    src={"https://crafthead.net/avatar/" + decoded.uuid + "/64.png"}
                    width="45"
                    height="45"
                    alt="logo"
                />
            </div>
        </Link>
    );
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
        margin: 1,
        padding: 0,
        transform: "translateX(6px)",
        "&.Mui-checked": {
            color: "#fff",
            transform: "translateX(22px)",
            "& .MuiSwitch-thumb:before": {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent("#fff")}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
            },
        },
    },
    "& .MuiSwitch-thumb": {
        backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
        width: 32,
        height: 32,
        "&:before": {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent("#fff")}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    "& .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        borderRadius: 20 / 2,
    },
}));

type Token = {
    username: string;
    uuid: string;
};

const logo = css({
    paddingTop: "10px",
    marginLeft: "10px",
});

const toggleSwitch = css({
    top: "8px",
});

const linkBoxStyle = css({
    textAlign: "center",
    paddingTop: "10px",
    paddingLeft: "40px",
    paddingRight: "40px",
    fontSize: "17px",
});

const headStyle = css({
    marginLeft: "25px",
});

const headImage = css({
    borderRadius: "12%",
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
    marginBottom: "40px",
});

const linkBox = css({
    display: "flex",
    marginLeft: "auto",
});

export default Header;
