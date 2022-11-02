import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Copyright } from "@mui/icons-material";
import { NextPage } from "next";
import { css } from "@emotion/css";
import Image from "next/image";

const theme = createTheme();

const Login: NextPage = () => {
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
            body: JSON.stringify({ username: username, password: password }),
        });

        if (res.status === 200) {
            const token = ((await res.json()) as Token).token;
            console.log(token);
        } else {
            const error = await res.text();
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
            <ThemeProvider theme={theme}>
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
                            <Image
                                src="/RaceAssist.svg"
                                width="195"
                                height="26"
                                alt="logo"
                            />
                        </a>
                        <Typography component="h1" variant="h5">
                            ログイン
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{ mt: 1 }}
                        >
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
                                sx={{ mt: 3, mb: 2 }}
                            >
                                ログイン
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
            );
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
