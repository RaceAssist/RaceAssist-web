import {createSlice} from "@reduxjs/toolkit";

type ThemeState = {
    theme: "light" | "dark";
};
const initialState: ThemeState = {
    theme: "light",
};

export const themeSlice = createSlice({
    name: "theme", initialState, reducers: {
        setDark: (state) => {
            state.theme = "dark";
        }, setLight: (state) => {
            state.theme = "light";
        }
    },
});


export const {setDark, setLight} = themeSlice.actions;
export const theme = themeSlice.getInitialState()
export default themeSlice.reducer;
