import React, { Component } from "react";
import ReactMarkdown from "react-markdown";

import { URL_DOCUMENT } from "../../shared/config";

class Doc extends Component {
  constructor(props) {
    super(props);
    this.state = { doc: "" };
  }

  componentDidMount() {
    fetch(URL_DOCUMENT + "/example.md", {
      method: "GET",
    }).then((res) => {
      res.text().then((markdown) => {
        this.setState({ doc: markdown });
      });
    });
  }

  render() {
    return <ReactMarkdown source={this.state.doc} />;
  }
}

export default Doc;
