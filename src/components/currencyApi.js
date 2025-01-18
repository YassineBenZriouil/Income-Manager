const API_KEY = "439d1088478b7dc4da122e28d5fa427e"; // Replace with your CurrencyLayer API key
const BASE_URL = "https://api.currencylayer.com/live";

/**
 * Fetches the exchange rate for the selected currency.
 * @param {string} currency - The target currency (e.g., "EUR", "GBP").
 * @returns {Promise<number>} - The exchange rate for the selected currency.
 */
export const fetchExchangeRate = async (currency) => {
    try {
        const response = await fetch(`${BASE_URL}?access_key=${API_KEY}`);
        if (!response.ok)
            throw new Error(`Network error: ${response.statusText}`);

        const data = await response.json();
        if (!data.success) throw new Error(data.error.info);

        const rate = data.quotes[`USD${currency}`];
        if (!rate) throw new Error(`Rate for ${currency} not found.`);

        return rate;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        return null;
    }
};

/**
 * Fetches all available currencies.
 * @returns {Promise<string[]>} - An array of currency codes (e.g., ["USD", "EUR", "GBP"]).
 */
export const allTheCurrenciesExtentions = async () => {
    try {
        const response = await fetch(`${BASE_URL}?access_key=${API_KEY}`);
        if (!response.ok)
            throw new Error(`Network error: ${response.statusText}`);

        const data = await response.json();
        if (!data.success) throw new Error(data.error.info);

        return Object.keys(data.quotes).map((key) => key.replace("USD", "")); // Remove "USD" prefix
    } catch (error) {
        console.error("Error fetching currencies:", error);
        return null;
    }
};
