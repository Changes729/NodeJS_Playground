import React from "react";
import { Switch } from "react-router";
import { Route } from "react-router-dom";
import { APP_NAME } from "../shared/config";
import HomePage from "./page/home";
import Doc from "./page/doc";
import Playground_Path from "./page/playground";
import NotFoundPage from "./page/not-found";
import {
  PAGE_ROUTE_ROOT,
  PAGE_ROUTE_DOC,
  PAGE_ROUTE_PLAYGROUND,
} from "../shared/routes";

const App = () => (
  <div>
    <Switch>
      <Route exact path={PAGE_ROUTE_ROOT} render={() => <HomePage />} />
      <Route path={PAGE_ROUTE_DOC} render={() => <Doc />} />
      <Route path={PAGE_ROUTE_PLAYGROUND} render={() => <Playground_Path />} />
      <Route component={NotFoundPage} />
    </Switch>
  </div>
);

export default App;
