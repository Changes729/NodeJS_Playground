import React, { Component, PureComponent } from "react";
import ReactDOM from "react-dom";

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
    return ReactDOM.createPortal(
      <div className="overlay">
        <span className="overlay-close" onClick={this.props.onClose}>
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
    const { name, path, preview } = this.state;
    return (
      <div>
        <h4>上传文件</h4>
        <div className="row">
          <label>文件名称</label>
          <input
            type="text"
            placeholder="请输入文件名"
            value={name}
            onChange={this.changeName}
          />
        </div>
        <div className="row">
          <label>文件路径</label>
          <div className="row-input">
            <span>{path ? path : "请选择文件路径"}</span>
            <input
              type="file"
              accept="video/*,image/*,text/plain"
              onChange={this.changePath}
            />
          </div>
        </div>
        <div className="media">{preview}</div>
        <button className="primary upload" onClick={this.upload}>
          上传
        </button>
        <button className="primary cancel" onClick={this.cancel}>
          取消
        </button>
      </div>
    );
  }
}

export default class Playground_Page extends Component {
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
