import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { DarkModeProvider } from "./context/DarkModeContext.jsx";
import { CartProvider } from "./context/CartItemCountContext.jsx";
import { SessionProvider } from "./context/SessionContext.jsx";
import { CategoriesProvider } from "./context/Category-SubCategoryContext";
import { NotificationProvider } from "./context/GlobalNotificationContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DarkModeProvider>
      <CartProvider>
        <SessionProvider>
          <CategoriesProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </CategoriesProvider>
        </SessionProvider>
      </CartProvider>
    </DarkModeProvider>
  </StrictMode>
);
