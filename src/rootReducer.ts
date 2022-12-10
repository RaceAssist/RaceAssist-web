import { themeSlice } from "./themeSlice";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
    theme: themeSlice.reducer,
});

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
