import React, { Component } from "react";
import ReactMarkdown from "react-markdown";

import { URL_DOCUMENT } from "../../shared/config";

class Doc extends Component {
  constructor(props) {
    super(props);
    this.state = { doc: "" };

    this.loadView = this.loadView.bind(this);
  }

  loadView(arg) {
    const hashFile = arg.length == 0 ? "" : arg.split("#")[1];

    fetch(URL_DOCUMENT + "/" + hashFile, {
      method: "GET",
    }).then((res) => {
      res.text().then((markdown) => {
        this.setState({ doc: markdown });
      });
    });
  }

  componentDidMount() {
    this.loadView(this.props.location.hash);
  }

  componentWillUpdate(nextProps) {
    if (this.props.location !== nextProps.location) {
      this.loadView(nextProps.location.hash);
    }
  }

  render() {
    return <ReactMarkdown source={this.state.doc} />;
  }
}

export default Doc;
