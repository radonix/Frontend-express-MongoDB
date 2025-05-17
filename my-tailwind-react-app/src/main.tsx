import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./main.css"; // Create this file for the new CSS classes

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Wrapping the app with BrowserRouter for routing */}
    <BrowserRouter>
      <div className="main-background">
        <div className="main-container">
          <App />
        </div>
      </div>
    </BrowserRouter>
  </StrictMode>  
);