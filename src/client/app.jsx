import React, { Component } from "react";
import { connect } from "react-redux";
import { Login, Room } from "./views";


class App extends Component {
  render() {
    const { username, room } = this.props;
    let body;
    if (username) {
      body = <Room />;
    } else {
      body = <Login />;
    }

    return <div>{body}</div>;
  }
}

function select({ app }) {
  return { ...app };
}

export default connect(select)(App);
