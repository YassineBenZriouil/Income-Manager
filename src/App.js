import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import "react-toastify/dist/ReactToastify.css";
import "./style/global.css";

import Home from "./components/home";
import Header from "./static/header";
import Form from "./components/form";

function App() {
    return (
        <Provider store={store}>
            <Router>
                {/* <Header /> */}
                <Routes>
                    <Route path="/" element={<Form />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;
