import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CareerProvider from "./context/CareerContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CareerProvider>
    <App />
  </CareerProvider>
);