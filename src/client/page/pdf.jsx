import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import "github-markdown-css";
import "../../../public/css/katex.css";
import { URL_API_FILE } from "../../shared/config";

class PDF extends Component {
  constructor(props) {
    super(props);
    this.state = { doc: "" };

    this.loadView = this.loadView.bind(this);
  }

  loadView(arg) {
    const hashFile = arg.length == 0 ? "" : arg.split("#")[1];

    fetch(URL_API_FILE + "/pdf/" + hashFile, {
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

export default PDF;
