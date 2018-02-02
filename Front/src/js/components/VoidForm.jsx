import React from 'react';

import phrases from '../../Phrases';

export default class VoidForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.update = this.update.bind(this);
  }

  update() {
    this.props.closeModal();
    this.props.match.setAsVoid();
    this.props.update(this.props.match);
  }

  render() {
    return (
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-6">
            <h2>{phrases.voidForm.heading}</h2>
          </div>
          <div className="col-xs-offset-5 col-xs-1">
            <i
              className="fa fa-window-close"
              style={{
              fontSize: '30px',
            }}
              aria-hidden="true"
              onClick={this.props.closeModal}
            />
          </div>
        </div>
        <div className="col-xs-12 margin-top-double">
          <div className="col-xs-2 col-xs-offset-4">
            <button className="btn btn-primary" onClick={this.update}>{phrases.general.yes}</button>
          </div>
          <div className="col-xs-2">
            <button className="btn btn-default" onClick={this.props.closeModal}>{phrases.general.no}</button>
          </div>
        </div>
      </div>
    );
  }

}
