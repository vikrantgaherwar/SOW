import "core-js";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { UserContextProvider } from "./UserContext";
import { FlyerContextProvider } from "./components/FlyerTool/FlyerContext";

ReactDOM.render(
  <UserContextProvider>
    <FlyerContextProvider>
      <App />
    </FlyerContextProvider>
  </UserContextProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
