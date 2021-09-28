import React, { Component } from "react";

class TdHead extends Component {
  constructor(props) {
    super(props);
    this.state = { select: false };

    this.Select = this.Select.bind(this);
  }

  Select() {
    if (this.state.select == false) {
      this.setState({ select: true });
    } else {
      this.setState({ select: false });
    }
    // console.log(this.state.select);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    const tdStyle = {
      backgroundColor: this.state.select ? "greenyellow" : "white",
    };

    return (
      <td onClick={this.Select} style={tdStyle}>
        {this.props.children}
      </td>
    );
  }
}

export default TdHead;
