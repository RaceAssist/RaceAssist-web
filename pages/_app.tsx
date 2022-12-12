import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import store from "../src/store";
import Theme from "../components/Theme";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps }: AppProps) {
    const persistedStore = persistStore(store);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistedStore}>
                <Theme>
                    <Component {...pageProps} />
                    <Analytics />
                </Theme>
            </PersistGate>
        </Provider>
    );
}

export default MyApp;
