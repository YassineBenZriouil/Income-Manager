// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice";

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});
