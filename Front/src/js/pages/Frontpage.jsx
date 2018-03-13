import React from 'react';

import phrases from '../../Phrases';
import lunalogo from '../../images/lunalogo-wobg.png';

export default class Frontpage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="container">
          <img src={lunalogo} alt="logo" />
          <h1>{phrases.frontPage.heading}</h1>
          <p className="lead">
            {phrases.frontPage.infoheading}
          </p>
        </div>
      </div>);
  }

}
