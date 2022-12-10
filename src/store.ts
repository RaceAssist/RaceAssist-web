import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import thunk from "redux-thunk";

const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk],
});

export type AppDispatch = typeof store.dispatch;

export default store;
