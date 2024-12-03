import React, { createContext, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from './AuthContext.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(

  <AuthProvider>
    <App />
  </AuthProvider>,

);