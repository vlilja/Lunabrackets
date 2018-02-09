import React from 'react';

import { checkLoginStatus, getUserDetails } from '../actions/loginActions';

export default class Frontpage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    checkLoginStatus();
    return (<div><h1>Frontpage</h1>
    <button onClick={getUserDetails}>USER</button></div>);
  }

}
