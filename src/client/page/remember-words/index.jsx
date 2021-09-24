import React, { Component } from "react";

import { PAGE_ROUTE_REMEMBER_WORDS } from "../../../shared/routes";
import { URL_API_FILE } from "../../../shared/config";
import "github-markdown-css";

class TdRevert extends Component {
  constructor(props) {
    super(props);
    this.state = { invert_value: "invert(50%)" };

    this.revert = this.revert.bind(this);
  }

  revert() {
    if (this.state.invert_value == "invert(50%)") {
      this.setState({ invert_value: "" });
    } else {
      this.setState({ invert_value: "invert(50%)" });
    }
    console.log(this.state.invert_value);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    const tdStyle = {
      filter: this.state.invert_value,
      backgroundColor: 'white'
    };

    return (
      <td onClick={this.revert} style={tdStyle}>
        {this.props.children}
      </td>
    );
  }
}

class RememberWordsIndex extends Component {
  constructor(props) {
    super(props);
    this.state = { raw: "", records: new Map() };

    this.loadView = this.loadView.bind(this);
    this.processWords = this.processWords.bind(this);
  }

  loadView() {
    const url_path = window.location.pathname;
    var fetch_path =
      URL_API_FILE +
      "/text" +
      url_path.substr(PAGE_ROUTE_REMEMBER_WORDS.length);

    fetch(fetch_path, {
      method: "GET",
    }).then((res) => {
      res.text().then((data) => {
        this.processWords(data);
      });
    });
  }

  processWords(data) {
    const re = /^\|(.*)\|(.*)\|$/;
    var record = this.state.records;
    var current_words_map = null;

    String(data)
      .split("\n")
      .forEach(function (str, i) {
        /* 空行、制表行、无内容表格行都跳过 */
        if (!/\S/.test(str)) return;
        var array = str.match(re);
        if (array != null) {
          array[1] = array[1].trim();
          array[2] = array[2].trim();
          // console.log(array);
          if (!/\S/.test(array[1]) && !/\S/.test(array[2])) return;
          if (/[-\s]+/.test(array[1]) && /[-\s]+/.test(array[2])) return;
        }

        /* 合法的单词表进行绘制，合法的其他内容单行显示 */
        if (array != null) {
          // console.log(array[1] + ":" + array[2]);
          current_words_map.set(array[1], array[2]);
        } else {
          current_words_map = new Map();
          record.set(str, current_words_map);
        }
      });

    this.setState({ records: record });
    // console.log(this.state.records);
    // console.log(record);
  }

  componentDidMount() {
    this.loadView();
  }

  render() {
    Array.from(this.state.records).map(
      (element, index) => console.log(element[0] + "----" + element[1])
      // Array.from(val).map((val, key) => console.log(key + ":" + val))
    );

    return (
      <div id="readme" className="container">
        <div className="markdown-body">
          {Array.from(this.state.records).map((element) => (
            <div>
              <p>{element[0]}</p>
              <table className="mainpagetable">
                {Array.from(element[1]).map((key_val) => (
                  <tr className="row" key={key_val[0]}>
                    <td>{key_val[0]}</td>
                    <TdRevert key={key_val[1]}>{key_val[1]}</TdRevert>
                  </tr>
                ))}
              </table>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default RememberWordsIndex;
