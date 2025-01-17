// src/components/DarkModeToggle.js
import React, { useState } from "react";

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark"); // Toggle dark class on the root element
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
            {darkMode ? "🌞" : "🌙"}
        </button>
    );
};

export default DarkModeToggle;
