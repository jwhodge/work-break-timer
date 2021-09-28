import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ReactFCCtest from "react-fcctest";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <ReactFCCtest />
  </React.StrictMode>,
  document.getElementById("root")
);
