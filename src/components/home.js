// src/components/Home.js
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToBalance, subtractFromBalance, resetUser } from "../redux/slice";
import { useNavigate } from "react-router-dom";
import PieChart from "./pieChart";
import DarkModeToggle from "./DarkModeToggle";
import HistoryTable from "./HistoryTable";
import { fetchExchangeRate } from "./currencyApi";

const Home = () => {
    const { name, balance, history } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState("");
    const [showResetConfirmation, setShowResetConfirmation] = useState(false);
    const [currencySelection, setCurrencySelection] = useState("USD"); // Track selected currency
    const [exchangeRate, setExchangeRate] = useState(1); // Default rate for USD
    const [isLoading, setIsLoading] = useState(false); // Track loading state

    // Fetch exchange rate when currencySelection changes
    useEffect(() => {
        if (currencySelection === "USD") {
            setExchangeRate(1); // No conversion needed for USD
            return;
        }

        const fetchRate = async () => {
            setIsLoading(true);
            try {
                const rate = await fetchExchangeRate(currencySelection);
                if (rate) {
                    setExchangeRate(rate);
                }
            } catch (error) {
                console.error("Error fetching exchange rate:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRate();
    }, [currencySelection]);

    // Utility function to convert all monetary values
    const convertAllValues = (value) => {
        return value * exchangeRate; // Apply the exchange rate
    };

    // Convert balance, income, and expenses
    const convertedBalance = convertAllValues(balance);
    const totalIncome = history
        .filter((transaction) => transaction.type === "add")
        .reduce((acc, curr) => acc + curr.amount, 0);
    const convertedTotalIncome = convertAllValues(totalIncome);
    const totalSpent = history
        .filter((transaction) => transaction.type === "subtract")
        .reduce((acc, curr) => acc + curr.amount, 0);
    const convertedTotalSpent = convertAllValues(totalSpent);

    const handleAdd = () => {
        if (amount > 0 && category) {
            dispatch(addToBalance({ amount, category }));
            setAmount(0);
            setCategory("");
        }
    };

    const handleSubtract = () => {
        if (amount > 0 && category) {
            dispatch(subtractFromBalance({ amount, category }));
            setAmount(0);
            setCategory("");
        }
    };

    const handleReset = () => {
        setShowResetConfirmation(true);
    };

    const confirmReset = () => {
        dispatch(resetUser());
        navigate("/");
    };

    const cancelReset = () => {
        setShowResetConfirmation(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-end mb-4 space-x-4">
                    <DarkModeToggle />
                    <button
                        onClick={handleReset}
                        className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        RESET
                    </button>
                </div>
                {showResetConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                            <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">
                                Are you sure you want to reset? This will clear
                                all your data.
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={cancelReset}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmReset}
                                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                        Hello {name} 👋
                    </h1>
                    <h2 className="text-xl text-gray-700 dark:text-gray-300 mt-2">
                        Your current balance is{" "}
                        <span className="font-semibold">
                            {currencySelection} {convertedBalance.toFixed(2)}
                        </span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        💰 Total Income Today:{" "}
                        <span className="font-semibold">
                            {currencySelection}{" "}
                            {convertedTotalIncome.toFixed(2)}
                        </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        💸 Total Spent Today:{" "}
                        <span className="font-semibold">
                            {currencySelection} {convertedTotalSpent.toFixed(2)}
                        </span>
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-8">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <div className="w-full sm:flex-1">
                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(parseFloat(e.target.value))
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Enter the amount you want to add or subtract.
                            </p>
                        </div>
                        <div className="w-full sm:flex-1">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                <option value="Food">Food</option>
                                <option value="Transport">Transport</option>
                                <option value="Entertainment">
                                    Entertainment
                                </option>
                                <option value="Salary">Salary</option>
                                <option value="Other">Other</option>
                            </select>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Choose a category for this transaction.
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={handleAdd}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Add Income 💵
                        </button>
                        <button
                            onClick={handleSubtract}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Add Expense 💸
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        💡 Tip: Use the buttons above to add income or expenses.
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-8">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Currency
                    </label>
                    <select
                        value={currencySelection}
                        onChange={(e) => setCurrencySelection(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="INR">INR</option>
                        {/* Add more currencies as needed */}
                    </select>
                </div>
                <HistoryTable history={history} />
                <div className="mt-8 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                        Expense/Income Distribution 📊
                    </h3>
                    <PieChart history={history} />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        This chart shows how your income and expenses are
                        distributed across categories.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
