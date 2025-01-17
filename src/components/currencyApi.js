// src/utils/currencyAPI.js
const API_KEY = "439d1088478b7dc4da122e28d5fa427e"; // Replace with your CurrencyLayer API key
const BASE_URL = "http://api.currencylayer.com/live";

/**
 * Fetches the exchange rate for the selected currency.
 * @param {string} currency - The target currency (e.g., "EUR", "GBP").
 * @returns {Promise<number>} - The exchange rate for the selected currency.
 */
export const fetchExchangeRate = async (currency) => {
    try {
        console.log("Fetching exchange rate for:", currency);
        const response = await fetch(`${BASE_URL}?access_key=${API_KEY}`);
        console.log("Raw response:", response);

        if (!response.ok) {
            throw new Error(
                `Network response was not ok: ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log("Response JSON:", data);

        if (!data.success) {
            console.error("API Error Info:", data.error);
            throw new Error(data.error.info);
        }

        const rate = data.quotes[`USD${currency}`]; // Get the rate for the selected currency
        if (!rate) {
            throw new Error(`Exchange rate for ${currency} not found.`);
        }

        console.log("Exchange rate fetched successfully:", rate);
        return rate;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        return null;
    }
};
