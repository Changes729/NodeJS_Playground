import React from "react";
import { Switch } from "react-router";
import { Route } from "react-router-dom";
import { APP_NAME } from "../shared/config";
import HomePage from "./page/home";
import Doc from "./page/doc";
import PDF from "./page/pdf";
import UploadDemo from "./page/upload";
import Playground_Page from "./page/playground";
import NotFoundPage from "./page/not-found";
import LearnGraphQL from "./page/graphql";
import RememberWords from "./page/remember-words/index";
import {
  PAGE_ROUTE_ROOT,
  PAGE_ROUTE_DOC,
  PAGE_ROUTE_PDF,
  PAGE_ROUTE_UPLOAD,
  PAGE_ROUTE_PLAYGROUND,
  PAGE_ROUTE_REMEMBER_WORDS,
  PAGE_ROUTE_LEARN_GRAPHQL,
} from "../shared/routes";

const App = () => (
  <div>
    <Switch>
      <Route exact path={PAGE_ROUTE_ROOT} render={() => <HomePage />} />
      <Route path={PAGE_ROUTE_DOC} component={Doc} />
      <Route path={PAGE_ROUTE_PDF} component={PDF} />
      <Route path={PAGE_ROUTE_UPLOAD} render={() => <UploadDemo />} />
      <Route path={PAGE_ROUTE_REMEMBER_WORDS} render={() => <RememberWords />} />
      <Route path={PAGE_ROUTE_PLAYGROUND} render={() => <Playground_Page />} />
      <Route path={PAGE_ROUTE_LEARN_GRAPHQL} render={() => <LearnGraphQL />} />
      <Route component={NotFoundPage} />
    </Switch>
  </div>
);

export default App;
