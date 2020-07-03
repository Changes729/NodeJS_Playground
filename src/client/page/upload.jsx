import React, { Component, PureComponent } from "react";
import ReactDOM from "react-dom";
import withStyles, { createUseStyles } from "react-jss";
import jss from "jss";
import preset from "jss-preset-default";

jss.setup(preset());

class Overlay extends Component {
  constructor(props) {
    super(props);
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
  }

  componentWillUnmount() {
    document.body.removeChild(this.container);
  }

  render() {
    const style = {
      overlay: {
        boxSizing: "border-box",
        position: "fixed",
        top: "50%",
        left: "50%",
        width: 600,
        height: 500,
        margin: { left: -300, top: -310 },
        backgroundColor: "#fff",
        outline: "rgba(0,0,0,.5) solid 9999px",
        borderRadius: 5,
      },
      overlayClose: {
        position: "absolute",
        top: 5,
        right: 15,
        color: "#000",
        cursor: "pointer",
        fontSize: 40,
        lineHeight: "40px",
        fontWeight: "lighter",
        opacity: 0.4,
        "&:hover": {
          opacity: 1,
        },
      },
    };

    const { classes } = jss.createStyleSheet(style).attach();

    return ReactDOM.createPortal(
      <div class={classes.overlay}>
        <span class={classes.overlayClose} onClick={this.props.onClose}>
          &times;
        </span>
        {this.props.children}
      </div>,
      this.container
    );
  }
}

class UploadFile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      path: "",
      preview: null,
      data: null,
    };

    this.changeName = this.changeName.bind(this);
    this.changePath = this.changePath.bind(this);
    this.upload = this.upload.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  changeName(e) {
    this.setState({ name: e.target.value });
  }

  changePath(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    let src,
      preview,
      type = file.type;
    if (/^image\/\S+$/.test(type)) {
      src = URL.createObjectURL(file);
      preview = <img src={src} alt="" />;
    } else if (/^video\/\S+$/.test(type)) {
      src = URL.createObjectURL(file);
      preview = <video src={src} autoPlay loop controls />;
    } else if (/^text\/\S+$/.test(type)) {
      const self = this;
      const reader = new FileReader();
      reader.readAsText(file);
      //注：onload是异步函数，此处需独立处理
      reader.onload = function (e) {
        preview = <textarea value={this.result} readOnly></textarea>;
        self.setState({ path: file.name, data: file, preview: preview });
      };
      return;
    }
    this.setState({ path: file.name, data: file, preview: preview });
  }

  upload() {
    const data = this.state.data;
    if (!data) {
      console.log("未选择文件");
      return;
    }

    //此处的url应该是服务端提供的上传文件api
    // const url = 'http://localhost:3000/api/upload';
    const url = "http://localhost:8000/";

    const form = new FormData();

    //此处的file字段由服务端的api决定，可以是其它值
    form.append("file", data);

    fetch(url, {
      method: "POST",
      body: form,
    }).then((res) => {
      console.log(res);
    });
  }

  cancel() {
    this.props.closeOverlay();
  }

  render() {
    const styles = {
      button_upload: {
        float: "right",
        margin: "20px 54px  20px 0",
        height: "30px",
        padding: "6px 40px",
        border: {
          style: "none",
          radius: "4px",
        },
        color: "#fff",
        background:
          "-webkit-gradient(linear, left 0, right 0, from(#00bcff), to(#00d8ff))",
        "&:hover": {
          background: "#00bcffFF",
        },
      },
      button_cancel: {
        float: "right",
        margin: "20px 25px 20px 0",
        height: "30px",
        padding: "6px 40px",
        color: "#808080",
        background: { color: "#fff" },
        border: {
          style: "solid",
          width: " 1px",
          color: "#adadad",
          radius: "4px",
        },
        "&:hover": {
          background: { color: "#f7f7f7" },
        },
      },
      media: {
        width: 498,
        height: 200,
        border: { style: "solid", width: 1, color: "#bbb" },
        margin: { left: 45 },
        display: "flex",
        justify: { content: "center" },
        align: { items: "center" },
        "& video": {
          max: {
            width: 498,
            height: 198,
            border: { style: "none" },
          },
        },
        "& img": {
          width: 498,
          height: 198,
          border: { style: "none" },
        },
        "& textarea": {
          width: 498,
          height: 198,
          border: { style: "none" },
          resize: "none",
          box: { sizing: "border-box" },
          padding: 10,
        },
      },
      row: {
        height: 30,
        lineHeight: "30px",
        fontSize: 14,
        margin: "40px auto",
        "& label": {
          margin: {
            left: 45,
            right: 10,
          },
          fontWeight: "bold",
        },
        "& input": {
          border: "solid 1px #bbb",
          height: 30,
          width: 430,
          textIndent: 10,
          fontSize: 14,
        },
      },
      rowInput: {
        display: "inline-block",
        outline: "solid 1px #bbb",
        backgroundColor: "#eee",
        position: "relative",
        "& input": {
          opacity: 0,
        },
        "& span": {
          position: "absolute",
          left: 10,
          fontWeight: "normal",
          opacity: 0.3,
        },
      },
    };

    const { name, path, preview } = this.state;
    const { classes } = jss.createStyleSheet(styles).attach();

    return (
      <div>
        <h4>上传文件</h4>
        <div class={classes.row}>
          <label>文件名称</label>
          <input
            type="text"
            placeholder="请输入文件名"
            value={name}
            onChange={this.changeName}
          />
        </div>
        <div class={classes.row}>
          <label>文件路径</label>
          <div class={classes.rowInput}>
            <span>{path ? path : "请选择文件路径"}</span>
            <input
              type="file"
              accept="video/*,image/*,text/plain"
              onChange={this.changePath}
            />
          </div>
        </div>
        <div class={classes.media}>{preview}</div>
        <button class={classes.button_upload} onClick={this.upload}>
          上传
        </button>
        <button class={classes.button_cancel} onClick={this.cancel}>
          取消
        </button>
      </div>
    );
  }
}

export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overlayActive: false,
    };

    this.closeOverlay = this.closeOverlay.bind(this);
    this.showOverlay = this.showOverlay.bind(this);
  }

  closeOverlay() {
    this.setState({ overlayActive: false });
  }

  showOverlay() {
    this.setState({ overlayActive: true });
  }

  render() {
    return (
      <div>
        {this.state.overlayActive && (
          <Overlay onClose={this.closeOverlay}>
            <UploadFile closeOverlay={this.closeOverlay} />
          </Overlay>
        )}
        <button onClick={this.showOverlay}>show</button>
      </div>
    );
  }
}
