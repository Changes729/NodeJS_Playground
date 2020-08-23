/* Private include -----------------------------------------------------------*/
import fs from "fs";
import { ApolloServer, UserInputError } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

/* Private define ------------------------------------------------------------*/
let SCHEMA_GRAPHQL_PATH = "src/server/schema.graphql";

/* Private typedef -----------------------------------------------------------*/
const GraphQLDate = new GraphQLScalarType({
  name: "GraphQLDate",
  description: "A Date() type in GraphQL as a scalar",
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    const dateValue = new Date(value);
    return isNaN(dateValue) ? undefined : dateValue;
  },
  parseLiteral(value_node) {
    if (value_node.kind == Kind.STRING) {
      const value = new Date(value_node.value);
      return isNaN(value) ? undefined : value;
    }
  },
});

/* Private variables ---------------------------------------------------------*/
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

function issueValidate(issue) {
  const errors = [];
  if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.');
  }
  if (issue.status == "Assigned" && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned"');
  }
  if (errors.length > 0) {
    throw new UserInputError("Invalid input(s)", { errors });
  }
}

function issueList() {
  return issuesDB;
}

function setAboutMessage(_, { message }) {
  return (aboutMessage = message);
}

function issueAdd(_, { issue }) {
  issueValidate(issue);
  issue.created = new Date();
  issue.id = issuesDB.length + 1;
  if (issue.status == undefined) issue.status = "New";
  issuesDB.push(issue);
  return issue;
}

const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList,
  },
  Mutation: {
    setAboutMessage,
    issueAdd,
  },
  GraphQLDate,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(SCHEMA_GRAPHQL_PATH, "utf-8"),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

export default server;
