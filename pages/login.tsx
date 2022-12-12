import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { NextPage } from "next";
import { css } from "@emotion/css";
import Image from "next/image";
import { useRouter } from "next/router";
import nookies from "nookies";
import { CookieSerializeOptions } from "next/dist/server/web/types";
import React from "react";

const Login: NextPage = () => {
    const router = useRouter();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get("username");
        const password = data.get("password");

        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (res.status === 200) {
            const token = ((await res.json()) as Token).token;
            const options: CookieSerializeOptions = {
                maxAge: 30 * 24 * 60 * 60,
                secure: true,
                path: "/",
            };

            nookies.set(null, "token", token, options);
            await router.push("/");
        } else {
            const error = await res.text();
            if (res.status === 504) {
                alert("サーバーが停止しています。 しばらくしてから再度お試しください。");
            }
            if (error === "Password is incorrect") {
                alert("パスワードが違います");
            } else if (error === "This player has never played before") {
                alert("ユーザーが存在しません");
            } else if (error === "This player is not registered") {
                alert("登録されていない名前です");
            } else if (error == "This player is banned") {
                alert("あなたはBANされています");
            }
        }
    };

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <a className={logo}>
                        <Image src="/RaceAssist.svg" width="195" height="26" alt="logo" />
                    </a>
                    <Typography component="h1" variant="h5">
                        ログイン
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="ユーザー名"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="パスワード"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                            }}
                        >
                            ログイン
                        </Button>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

const logo = css({
    paddingBottom: "10px",
});

type Token = {
    token: string;
};

export default Login;
