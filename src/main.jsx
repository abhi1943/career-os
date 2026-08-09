import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import CareerProvider from "./context/CareerContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CompareProvider } from "./context/CompareContext";
import { GoalProvider } from "./context/GoalContext";
import { AssessmentProvider } from "./context/AssessmentContext";
import { AuthProvider } from "./context/AuthContext";

import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <GoalProvider>
      <CompareProvider>
        <FavoritesProvider>
          <CareerProvider>
            <AssessmentProvider>
              <App />
            </AssessmentProvider>
          </CareerProvider>
        </FavoritesProvider>
      </CompareProvider>
    </GoalProvider>
  </AuthProvider>
);