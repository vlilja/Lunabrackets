import React from 'react'
import Navbar from "./Navbar";
import { Link } from 'react-router'
require('../../stylesheets/base.scss');

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
  return (  <div>
      <Navbar />
      <div>{this.props.children}</div>
    </div>
  )
}
}
