import React from "react";

export default class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      title: "Welcome",
    };
  }

  changeTitle(title) {
    this.setState({title});
  }

  render() {
    return (
      <div>
        <h1>This is a heading for my App!</h1>
        Stuff here
      </div>
    );
  }
}
