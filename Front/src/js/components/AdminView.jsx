import React from 'react';

import LeagueStartForm from './LeagueStartForm';
import EndGroupStageForm from './EndGroupStageForm';
import EndQualifiersForm from './EndQualifiersForm';
import EndLeagueForm from './EndLeagueForm';

import phrases from '../../Phrases';

export default class AdminView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.renderControls = this.renderControls.bind(this);
  }

  renderControls() {
    let element;
    switch (this.props.league.stage) {
      case 'ready': {
        element = <LeagueStartForm gameType={this.props.league.gameType} startLeague={this.props.startLeague} players={this.props.league.players} />;
        break;
      }
      case 'group': {
        element = <EndGroupStageForm league={this.props.league} startQualifiers={this.props.startQualifiers} />;
        break;
      }
      case 'qualifiers': {
        element = <EndQualifiersForm league={this.props.league} getUndetermined={this.props.getUndetermined} updateUndetermined={this.props.updateUndetermined} startFinals={this.props.startFinals} />;
        break;
      }
      case 'finals': {
        element = <EndLeagueForm league={this.props.league} finishLeague={this.props.finishLeague} />;
        break;
      }
      case 'complete': {
        element = <div>{phrases.adminView.leagueComplete}</div>;
        break;
      }
      default: {
        element = null;
      }
    }
    return element;
  }

  render() {
    const form = this.renderControls();
    return (
      <div>
        <div className="col-xs-12">
          <h3>{`${phrases.adminView.currentStage}: ${this.props.league.stage}`}</h3>
        </div>
        <div className="col-xs-12">
          {form}
        </div>
      </div>
    );
  }

}
