import CssBaseline from "@mui/material/CssBaseline";
import React, { ReactNode } from "react";
import {
    Experimental_CssVarsProvider as CssVarsProvider, experimental_extendTheme as extendTheme,
} from "@mui/material/styles";


const customTheme = extendTheme({
    colorSchemes: {
        dark: {
            palette: {
                text: {
                    primary: "#fff", secondary: "rgba(255, 255, 255, 0.7)", disabled: "rgba(255, 255, 255, 0.5)",
                }, action: {
                    active: "#fff",
                    hover: "rgba(255, 255, 255, 0.08)",
                    selected: "rgba(255, 255, 255, 0.16)",
                    disabled: "rgba(255, 255, 255, 0.3)",
                    disabledBackground: "rgba(255, 255, 255, 0.12)",
                }, background: {
                    default: "#121212", paper: "#1f1f1f",
                }, divider: "rgba(255, 255, 255, 0.12)", custom: {
                    footer: "#676767", card: "#2b2a2a",
                },
            },
        },
        light: {
            palette: {
                text: {
                    primary: "rgba(0, 0, 0, 0.87)", secondary: "rgba(0, 0, 0, 0.6)", disabled: "rgba(0, 0, 0, 0.38)",
                }, action: {
                    active: "rgba(0, 0, 0, 0.54)",
                    hover: "rgba(0, 0, 0, 0.04)",
                    selected: "rgba(0, 0, 0, 0.08)",
                    disabled: "rgba(0, 0, 0, 0.26)",
                    disabledBackground: "rgba(0, 0, 0, 0.12)",
                }, background: {
                    default: "#fff", paper: "rgba(200, 200, 200, 0.85)",
                }, divider: "rgba(0, 0, 0, 0.12)", custom: {
                    footer: "#0066ff", card: "rgba(200, 200, 200, 0.85)",
                },
            },
        },
    },
});


export const Theme = ({ children }: { children: ReactNode }) => {
    return (
        <CssVarsProvider defaultMode={'dark'} theme={customTheme}>
            <CssBaseline />
            {children}
        </CssVarsProvider>);
};

export default Theme;


declare module "@mui/material/styles" {
    interface Palette {
        custom: {
            footer: string;
            card: string;
        };
    }

    interface PaletteOptions {
        custom?: {
            footer?: string;
            card?: string;
        };
    }
}