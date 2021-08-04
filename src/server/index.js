/* Private include -----------------------------------------------------------*/
import fs from "fs";
import compression from "compression";
import express from "express";
import multer from "multer";
import { Server } from "http";

import {
  APP_NAME,
  STATIC_PATH,
  WEB_PORT,
  URL_API_FILE,
} from "../shared/config";
import { isProd } from "../shared/util";
import {
  API_UPLOAD_URL,
  API_UPLOAD_DIR,
  FIELD_NAME,
} from "../shared/app/define_upload";
import { PAGE_ROUTE_DOC } from "../shared/routes";
import apolloServer from "./graphQL";
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

// curl 'http://localhost:8000/graphql?query=query{about}'
apolloServer.applyMiddleware({ app, path: "/graphql" });

app.get(URL_API_FILE + "/text/*", (req, res) => {
  const uri = decodeURI(req.url);
  const aim_path = uri.substr(String(URL_API_FILE + "/text/").length);
  const filepath = _FILE_URL + "/text/" + aim_path;

  if (!filepath.endsWith("/")) {
    res.sendFile(process.cwd() + "/" + filepath);
  } else if (fs.existsSync(filepath + "README.md")) {
    res.sendFile(process.cwd() + "/" + filepath + "README.md");
  } else {
    var buffer = String("");
    if (fs.statSync(filepath).isDirectory()) {
      fs.readdirSync(filepath).forEach((value) => {
        if (fs.statSync(filepath + value).isDirectory()) value += "/";
        buffer += String(
          "[" + value + "](" + PAGE_ROUTE_DOC + aim_path + value + ")\r\n\r\n"
        );
      });
    } else {
      // nothing todo now.
    }
    res.send(buffer);
  }
});

app.get("/Changes729_image/raw/main/ln/*", (req, res) => {
  const uri = decodeURI(req.url);
  const aim_path = uri.substr(String("/Changes729_image/raw/main/ln/").length);
  const filepath = _FILE_URL + "/image/ln/" + aim_path;

  if (!filepath.endsWith("/")) {
    res.sendFile(process.cwd() + "/" + filepath);
  }
});

app.get(URL_API_FILE + "/*", (req, res) => {
  const uri = decodeURI(req.url);
  const aim_path = uri.substr(String(URL_API_FILE).length + 1); // 1 for '/'
  const filepath = _FILE_URL + aim_path;

  if (!filepath.endsWith("/")) {
    res.sendFile(process.cwd() + "/" + filepath);
  } else if (fs.existsSync(filepath + "index.html")) {
    res.sendFile(process.cwd() + "/" + filepath + "index.html");
  } else if (fs.existsSync(filepath + "README.md")) {
    res.sendFile(process.cwd() + "/" + filepath + "README.md");
  } else {
    var buffer = String("");
    if (fs.statSync(filepath).isDirectory()) {
      fs.readdirSync(filepath).forEach((value) => {
        if (fs.statSync(filepath + value).isDirectory()) value += "/";
        buffer += String(
          "[" +
            value +
            "](" +
            encodeURI(URL_API_FILE + "/" + aim_path + value) +
            ")\r\n\r\n"
        );
      });
    } else {
      // nothing todo now.
    }
    res.send(buffer);
  }
});

app.delete(URL_API_FILE + "/:path?" + "/:filename?", (req, res) => {
  var success = false;
  const path = _FILE_URL + req.params.path;

  if (req.params.filename) {
    fs.unlinkSync(path + req.params.filename);
    success = true;
  }

  res.send(success ? "ok" : "failed");
});

app.get("/*", (req, res) => {
  res.send(renderApp(APP_NAME));
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
