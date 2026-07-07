import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import { prewarmApiData } from "./api";

prewarmApiData();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window.setTimeout(() => {
  document.body.classList.add("app-ready");
}, 650);
