import React from "react";
import ReactMarkdown from "react-markdown"
import documet from "../doc/example.md"

const Doc = () => <ReactMarkdown source={documet} />;

export default Doc;