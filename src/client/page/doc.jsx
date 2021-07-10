import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import "github-markdown-css";
import "../../../public/css/katex.css";

import { URL_API_FILE } from "../../shared/config";

class Doc extends Component {
  constructor(props) {
    super(props);
    this.state = { doc: "" };

    this.loadView = this.loadView.bind(this);
  }

  loadView(arg) {
    const url_path = window.location.pathname;
    var fetch_path = URL_API_FILE + "/text" + url_path.substr("/doc".length);
    if (arg.length != 0) {
      fetch_path += String("/" + arg.split("#")[1]);
    }

    fetch(fetch_path, {
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
    return (
      <div id="readme" class="container">
        <ReactMarkdown
          children={this.state.doc}
          className="markdown-body"
          skipHtml={false}
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        />
      </div>
    );
  }
}

export default Doc;
