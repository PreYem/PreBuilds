import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DarkModeProvider } from "./context/DarkModeContext.jsx";
import { CartProvider } from "./context/CartItemCountContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DarkModeProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </DarkModeProvider>
  </StrictMode>
);
