import React from 'react';

import phrases from '../../Phrases';
import Icons from './Icons';
import Modal from './Modal';


export default class EndGroupStageForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      numOfMatches: 0,
      matchesComplete: 0,
      loading: true,
      modalOpen: false,
    };
    this.startQualifiers = this.startQualifiers.bind(this);
  }

  startQualifiers() {
    const { numOfMatches, matchesComplete } = this.state;
    if (numOfMatches !== matchesComplete) {
      this.setState({ modalOpen: true });
    } else {
      this.props.startQualifiers();
    }
  }

  mapGroupStageMatchesStatus() {
    const { groups } = this.props.league;
    let element = <Icons type="LOADING" size="32px" />;
    if (groups) {
      const groupKeys = Object.keys(groups);
      let numOfMatches = 0;
      let matchesComplete = 0;
      groupKeys.forEach((key) => {
        numOfMatches += groups[key].matches.length;
        groups[key].matches.forEach((match) => {
          const result = match.getResult();
          if (result) {
            matchesComplete += 1;
          }
        });
      });
      this.state.numOfMatches = numOfMatches;
      this.state.matchesComplete = matchesComplete;
      this.state.loading = false;
      element = <div><h3>{`${phrases.endGroupStageForm.matchesComplete}: ${matchesComplete}/${numOfMatches}`}</h3></div>;
    }
    return element;
  }

  renderModal() {
    return (<Modal
      open={this.state.modalOpen}
      classes={[
    'col-xs-8 col-xs-offset-2 col-lg-4 col-lg-offset-4 small-modal',
    ]}
      bgclasses={['modal-back-ground']}
    ><div className="col-xs-12">
      <div className="row">
        <div className="col-xs-6">
          <h2>{phrases.endGroupStageForm.modalHeading}</h2>
        </div>
        <div className="col-xs-offset-5 col-xs-1">
          <i
            className="fa fa-window-close"
            style={{
            fontSize: '30px',
          }}
            aria-hidden="true"
            onClick={() => { this.setState({ modalOpen: false }); }}
          />
        </div>
      </div>
      <p className="lead">{phrases.endGroupStageForm.modalText}</p>
      <div className="col-xs-12">
        <div className="col-xs-6">
          <button className="btn btn-default" onClick={() => { this.setState({ modalOpen: false }); }}>{phrases.general.no}</button>
        </div>
        <div className="col-xs-6 text-right">
          <button className="btn btn-primary" onClick={() => { this.setState({ modalOpen: false }); this.props.startQualifiers(); }}>{phrases.general.yes}</button>
        </div>
      </div>
    </div>
    </Modal>);
  }

  render() {
    const status = this.mapGroupStageMatchesStatus();
    const modal = this.renderModal();
    return (<div className="col-xs-12 well">
      <h2>{phrases.endGroupStageForm.heading}</h2>
      <div className="panel panel-default">
        <div className="panel-body">
          <div>
            {status}
          </div>
        </div>
      </div>
      {this.state.loading ? '' : <div className="margin-top">
        <button className="btn btn-primary" onClick={this.startQualifiers} >{phrases.endGroupStageForm.startQualifiers}</button>
      </div>}
      {modal}
    </div>);
  }
}
