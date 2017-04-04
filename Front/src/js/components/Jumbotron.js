import React from "react";
require('../../stylesheets/jumbotron.scss');

export default class Jumbotron extends React.Component {

  render () {
    return <div className="jumbotron">
       <h1><img id="brand-logo" src="../../images/lunalogo.jpeg"/> Lunabrackets</h1>
    </div>
  }

}
