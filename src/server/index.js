/* Private include -----------------------------------------------------------*/
import compression from "compression";
import express from "express";
import multer from "multer";
import { Server } from "http";
import fs from "fs";

import {
  APP_NAME,
  STATIC_PATH,
  WEB_PORT,
  URL_DOCUMENT,
} from "../shared/config";
import { isProd } from "../shared/util";
import {
  API_UPLOAD_URL,
  API_UPLOAD_DIR,
  FIELD_NAME,
} from "../shared/app/define_upload";
import renderApp from "./render-app";

/* Private variables ---------------------------------------------------------*/
const _FILE_URL = API_UPLOAD_DIR;
const app = express();
const http = Server(app);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var uploadDir = API_UPLOAD_DIR + file.mimetype.split("/")[0] + "/";

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

app.use(compression());
app.use(STATIC_PATH, express.static("dist"));
app.use(STATIC_PATH, express.static("public"));

app.get("/", (req, res) => {
  res.send(renderApp(APP_NAME));
});

app.get(URL_DOCUMENT + "/:filename", (req, res) => {
  const buffer = fs.readFileSync(_FILE_URL + "text/" + req.params.filename);
  res.send(buffer.toString());
});

app.post(API_UPLOAD_URL, upload.single(FIELD_NAME), function (req, res) {
  res.send("ok");
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
