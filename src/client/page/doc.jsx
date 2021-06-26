import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import "github-markdown-css";

import { URL_API_FILE } from "../../shared/config";

class Doc extends Component {
  constructor(props) {
    super(props);
    this.state = { doc: "" };

    this.loadView = this.loadView.bind(this);
  }

  loadView(arg) {
    const hashFile = arg.length == 0 ? "" : arg.split("#")[1];

    fetch(URL_API_FILE + "/text/" + hashFile, {
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
    return <div className='markdown-body'> <ReactMarkdown source={this.state.doc} escapeHtml={false} /> </div>;
  }
}

export default Doc;
