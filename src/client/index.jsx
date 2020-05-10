import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";

import App from "./app";
import { APP_CONTAINER_SELECTOR } from "../shared/config";
import Doc from "./page/doc";

const rootEl = document.querySelector(APP_CONTAINER_SELECTOR);

const wrapApp = (AppComponent) => (
  <BrowserRouter>
    <AppContainer>
      <AppComponent />
    </AppContainer>
    <Doc />
  </BrowserRouter>
);

ReactDOM.render(wrapApp(App), rootEl);

if (module.hot) {
  module.hot.accept("./app", () => {
    const NextApp = require("./app").default;
    ReactDOM.render(wrapApp(NextApp), rootEl);
  });
}
