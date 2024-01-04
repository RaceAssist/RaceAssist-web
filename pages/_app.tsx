import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import Theme from "../components/Theme";
import { Provider as JotaiProvider } from "jotai";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

function MyApp({
                   Component, pageProps,
               }: AppProps) {
    return (
        <JotaiProvider>
            <Theme>
                <CssVarsProvider defaultMode={"dark"}>
                    <Component {...pageProps} />
                </CssVarsProvider>
            </Theme>
        </JotaiProvider>
    );
}

export default MyApp;
