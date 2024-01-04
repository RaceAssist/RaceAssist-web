import Document, { Head, Html, Main, NextScript } from "next/document";
import { getInitColorSchemeScript } from "@mui/material/styles";

export default class MyDocument extends Document {
    render() {
        return (
            <Html data-color-scheme="light" lang="ja">
                <Head>
                    <link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Noto+Sans+JP&display=swap"
                          rel="stylesheet" />
                </Head>
                <body>
                {getInitColorSchemeScript()}
                <Main />
                <NextScript />
                </body>
            </Html>
        );
    }
}
