import React, { Component } from "react";

class WordsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: this.props.word,
      meaning: this.props.meaning,
      isShown: false,
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.state.isShown == false
      ? this.setState({ isShown: true })
      : this.setState({ isShown: false });
  }

  render() {
    return (
      <div onClick={this.onClick}>
        <div>{this.state.word}</div>
        {this.state.isShown && <div>{this.state.meaning}</div>}
      </div>
    );
  }
}

export default WordsCard;
