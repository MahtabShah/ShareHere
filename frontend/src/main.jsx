// import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { QuoteProvider } from "./context/QueotrContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QuoteProvider>
      <App />
    </QuoteProvider>
  </BrowserRouter>
);
