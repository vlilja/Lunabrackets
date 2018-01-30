import React from 'react';

import UndeterminedRankingsForm from './UndeterminedRankingsForm';
import PlayersToFinalsForm from './PlayersToFinalsForm';

export default class EndQualifiersForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (<div>
      <UndeterminedRankingsForm getUndetermined={this.props.getUndetermined} undetermined={this.props.league.undetermined} players={this.props.league.players} updateUndetermined={this.props.updateUndetermined} />
      <PlayersToFinalsForm league={this.props.league} startFinals={this.props.startFinals} />
    </div>);
  }
}
