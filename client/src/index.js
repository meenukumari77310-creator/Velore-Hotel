import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashRouter } from "react-router-dom";  // ✅ change here
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "leaflet/dist/leaflet.css";

import { AdminUserProvider } from "./Admin/AdminUserContext";
import "react-datepicker/dist/react-datepicker.css";

import { Provider } from "react-redux";
import { store } from './Redux/Store';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* ✅ Wrap with HashRouter */}
      <HashRouter>
        <AdminUserProvider>
          <Toaster position="top-right" />
          <App />
        </AdminUserProvider>
      </HashRouter>
    </Provider>
  </React.StrictMode>
);
