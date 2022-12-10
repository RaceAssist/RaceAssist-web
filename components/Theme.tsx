import { NextPage } from "next";
import { useSelector } from "react-redux";
import { RootState } from "../src/rootReducer";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { ReactNode } from "react";

function getActiveTheme(theme: "light" | "dark") {
    return theme === "light" ? lightTheme : darkTheme;
}

const lightTheme = createTheme({
    palette: {
        mode: "light",
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

export const Theme = ({ children }: { children: ReactNode }) => {
    return (
        <ThemeProvider theme={getActiveTheme(useSelector((state: RootState) => state.theme.theme))}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default Theme;
