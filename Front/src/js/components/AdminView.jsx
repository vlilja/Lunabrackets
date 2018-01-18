import React from 'react';

import LeagueStartForm from './LeagueStartForm';
import UndeterminedRankingsForm from './UndeterminedRankingsForm';
import phrases from '../../Phrases';

export default class AdminView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="col-xs-12">
          <h3>{`${phrases.adminView.currentStage}: ${this.props.league.stage}`}</h3>
        </div>
        <div className="col-xs-12">
          <LeagueStartForm gameType={this.props.league.gameType} startLeague={this.props.startLeague} players={this.props.league.players} />
        </div>
        <div className="col-xs-12">
          {this.props.league.stage === 'qualifiers' ? <UndeterminedRankingsForm updateUndetermined={this.props.updateUndetermined} players={this.props.league.players} getUndetermined={this.props.getUndetermined} undetermined={this.props.league.undetermined} /> : ''}
        </div>
      </div>
    );
  }

}
