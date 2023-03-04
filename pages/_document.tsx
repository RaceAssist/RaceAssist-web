import Document, { DocumentProps, Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document<DocumentProps> {
    render(): JSX.Element {
        return (
            <Html lang={"ja"}>
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
