import React, { Component } from "react";

import ReactMarkdown from "react-markdown";
import TdHead from "./widget/tdHead";
import TdRevert from "./widget/tdRevert";
import FoldMenu from "./widget/foldMenu";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";

import { PAGE_ROUTE_REMEMBER_WORDS } from "../../../shared/routes";
import { URL_API_FILE } from "../../../shared/config";
import "github-markdown-css";

/** 单词表主页 */
class RememberWordsIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      raw: "",
      records: new Map(),
      matchs: new Map(),
      selectIndex: 0,
    };

    this.loadView = this.loadView.bind(this);
    this.processWords = this.processWords.bind(this);
    this.SearchWords = this.SearchWords.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSelect = this.onSelect.bind(this);
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

  onKeyDown(e) {
    if (e.key === "Enter") {
      this.SearchWords(e.target.value);
    }
  }

  SearchWords(word) {
    var match = new Map();

    if (word != "") {
      console.log("[Info] search word: " + word);
      this.state.records.forEach((value, key) => {
        value.forEach((meaning, words) => {
          if (words.match(word) != null) {
            console.log("[Info] find word " + words + " in " + key);
            var record = new Map();
            record.set(words, meaning);
            match.set(key, record);
            return;
          }
        });
      });
    }

    this.setState({ matchs: match });
  }

  onSelect(e) {
    this.setState({ selectIndex: e.target.value });
  }

  render() {
    const styles = {
      fontFamily: "Sunflower, sans-serif",
      fontWeight: "300",
      fontSize: "1.5em",
      lineHeight: "1.6",
    };

    const selectStyle = {
      minWidth: "265px",
      minHeight: "45px",
      borderWidth: "3px",
      borderColor: "rgba(50, 50, 50, 0.14)",
      margin: "10px 10px 10px 0px",
    };

    const inputStyle = {
      width: "250px",
      height: "30px",
      textIndent: "10px",
      borderWidth: "3px",
      borderColor: "rgba(50, 50, 50, 0.14)",
      margin: "10px 10px 10px 0px",
      padding: "5px 5px 5px 5px",
    };

    return (
      <div style={styles}>
        <select onChange={this.onSelect} style={selectStyle}>
          <option value={-1}>全部</option>
          {Array.from(this.state.records).map((element, index) => (
            <option value={index} selected={index == 0 ? true : false}>
              {element[0]}
            </option>
          ))}
        </select>
        <input onKeyDown={this.onKeyDown} style={inputStyle}></input>
        {Array.from(
          this.state.matchs.size > 0 ? this.state.matchs : this.state.records
        ).map((element, index) =>
          this.state.selectIndex < 0 ||
          this.state.selectIndex == index ||
          this.state.matchs.size > 0 ? (
            <FoldMenu
              className="mainpagetable"
              title={element[0] + "(" + element[1].size + ")"}
              isShown={true}
            >
              {Array.from(element[1]).map((key_val) => (
                <tr className="row">
                  <TdHead>
                    <ReactMarkdown
                      skipHtml={false}
                      children={key_val[0]}
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex, rehypeRaw]}
                    />
                  </TdHead>
                  <TdRevert>
                    <ReactMarkdown
                      skipHtml={false}
                      children={key_val[1]}
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex, rehypeRaw]}
                    />
                  </TdRevert>
                </tr>
              ))}
            </FoldMenu>
          ) : (
            <div></div>
          )
        )}
      </div>
    );
  }
}

export default RememberWordsIndex;
