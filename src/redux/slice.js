import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        name: "",
        balance: 0,
        history: [],
        currencies: [], // Add currencies to the initial state
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
        setCurrencies: (state, action) => {
            state.currencies = action.payload; // Add a reducer to set currencies
        },
    },
});

export const {
    setUser,
    addToBalance,
    subtractFromBalance,
    resetUser,
    setCurrencies,
} = userSlice.actions;

export default userSlice.reducer;
