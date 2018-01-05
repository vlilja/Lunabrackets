import React from 'react';

import phrases from '../../Phrases';
import helper from '../helpers/helper';

export default class LeaguePanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gameName: '',
    };
    this.setGameName = this.setGameName.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.setGameName(this.props.league.gameType);
  }

  setGameName(gameId) {
    const name = helper.determineGameName(gameId);
    this.setState({ gameName: name });
  }

  handleClick() {
    this.props.navigateTo(this.props.league.id);
  }

  render() {
    return (
      <div className="panel panel-primary clickable" onClick={this.handleClick} role="button" tabIndex={0} >
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.league.name}</h3>
        </div>
        <div className="panel-body">
          <span>{phrases.general.game}:</span> {this.state.gameName}<br />
          <span>{phrases.general.stage}:</span> {this.props.league.stage}
        </div>
      </div>
    );
  }

}
