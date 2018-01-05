import React from 'react';
import phrases from '../../Phrases';

export default class WalkOverForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { player } = this.props;
    return (
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-6">
            <h2>{phrases.walkOverForm.heading}</h2>
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
        <div className="col-xs-12">
          <h3>{`${phrases.walkOverForm.message} ${player.firstName} ${player.lastName}?`}</h3>
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
