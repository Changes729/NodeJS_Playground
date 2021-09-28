import React, { Component } from "react";

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
    // console.log(this.state.invert_value);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    const tdStyle = {
      filter: this.state.invert_value,
      backgroundColor: "white",
    };

    return (
      <td onClick={this.revert} style={tdStyle}>
        {this.props.children}
      </td>
    );
  }
}

export default TdRevert;
