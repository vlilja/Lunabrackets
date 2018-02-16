import React from 'react';

import phrases from '../../Phrases';

export default class Frontpage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="container">
          <h1>{phrases.frontPage.heading}</h1>
          <p className="lead">
            {phrases.frontPage.infoheading}
          </p>
        </div>
      </div>);
  }

}
