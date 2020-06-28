/* Private include -----------------------------------------------------------*/
import compression from "compression";
import express from "express";
import { Server } from "http";

import { APP_NAME, STATIC_PATH, WEB_PORT } from "../shared/config";
import { isProd } from "../shared/util";
import renderApp from "./render-app";
import uploadApp from "./apps/upload/main";

/* Private variables ---------------------------------------------------------*/
const app = express();
const http = Server(app);

app.use(compression());
app.use(STATIC_PATH, express.static("dist"));
app.use(STATIC_PATH, express.static("public"));

app.get("/", (req, res) => {
  res.send(renderApp(APP_NAME));
});

app.get("/demo_file", (req, res) => {
  res.download(
    "/home/asuki/GitSource/NodeJS_Playground/src/client/doc/example.md"
  );
});

app.post("/", function (req, res) {
  // TODO maybe need response.
  uploadApp(req, res);
});

http.listen(WEB_PORT, () => {
  console.log(
    `Server running on port ${WEB_PORT} ${
      isProd
        ? "(production)"
        : '(development).\nKeep "yarn dev:wds" running in an other terminal'
    }.`
  );
});
