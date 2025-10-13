import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';   // For carousel JS 
import "leaflet/dist/leaflet.css";


import { AdminUserProvider } from "./Admin/AdminUserContext";
import "react-datepicker/dist/react-datepicker.css";

// Redux setup
import { Provider } from "react-redux";
import { store } from './Redux/Store'

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <AdminUserProvider>
          <Toaster position="top-right" />
          <App />
        </AdminUserProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
