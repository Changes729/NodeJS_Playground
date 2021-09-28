import React, { Component } from "react";

class FoldMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { isShown: this.props.isShown ? this.props.isShown : false };

    this.onClicked = this.onClicked.bind(this);
  }

  onClicked() {
    this.state.isShown
      ? this.setState({ isShown: false })
      : this.setState({ isShown: true });
  }

  render() {
    return (
      <div>
        <p onClick={this.onClicked}>{this.props.title}</p>
        {this.state.isShown && <table>{this.props.children}</table>}
      </div>
    );
  }
}

export default FoldMenu;
