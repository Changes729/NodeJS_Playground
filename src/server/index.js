/* Private include -----------------------------------------------------------*/
import compression from "compression";
import express from "express";
import multer from "multer";
import { Server } from "http";
import fs from "fs";
import { ApolloServer } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";

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

let aboutMessage = "Issue Tracker API v1.0";

const issuesDB = [
  {
    id: 1,
    status: "New",
    owner: "Ravan",
    effort: 5,
    created: new Date("2019-01-15"),
    due: undefined,
    title: "Error in console when clicking Add",
  },
  {
    id: 2,
    status: "Assigned",
    owner: "Eddie",
    effort: 14,
    created: new Date("2019-01-16"),
    due: new Date("2019-02-01"),
    title: "Missing bottom border on panel",
  },
];

const GraphQLDate = new GraphQLScalarType({
  name: "GraphQLDate",
  description: "A Date() type in GraphQL as a scalar",
  serialize(value) {
    return value.toISOString();
  },
});

const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList,
  },
  Mutation: {
    setAboutMessage,
  },
  GraphQLDate,
};

function setAboutMessage(_, { message }) {
  return (aboutMessage = message);
}

function issueList() {
  return issuesDB;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync("src/server/schema.graphql", "utf-8"),
  resolvers,
});

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
server.applyMiddleware({ app, path: "/graphql" });

app.get(URL_DOCUMENT + "/:filename?", (req, res) => {
  var buffer = String();
  const path = _FILE_URL + "text/";

  if (req.params.filename) {
    buffer = fs.readFileSync(path + req.params.filename);
  } else {
    if (fs.statSync(path).isDirectory()) {
      fs.readdirSync(path).forEach((value) => {
        buffer += String("[" + value + "](#" + value + ")\r\n\r\n");
      });
    } else {
      // nothing todo now.
    }
  }

  res.send(buffer.toString());
});

app.delete(URL_DOCUMENT + "/:filename?", (req, res) => {
  var success = false;
  const path = _FILE_URL + "text/";

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
