// src/redux/slice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        name: "",
        balance: 0,
        history: [],
    },
    reducers: {
        setUser: (state, action) => {
            state.name = action.payload.name;
            state.balance = action.payload.balance;
        },
        addToBalance: (state, action) => {
            const { amount, category } = action.payload;
            state.balance += amount;
            state.history.push({
                date: new Date().toISOString(),
                category,
                amount,
                type: "add",
            });
        },
        subtractFromBalance: (state, action) => {
            const { amount, category } = action.payload;
            state.balance -= amount;
            state.history.push({
                date: new Date().toISOString(),
                category,
                amount,
                type: "subtract",
            });
        },
        resetUser: (state) => {
            state.name = "";
            state.balance = 0;
            state.history = [];
        },
    },
});

export const { setUser, addToBalance, subtractFromBalance, resetUser } =
    userSlice.actions;

export default userSlice.reducer;
