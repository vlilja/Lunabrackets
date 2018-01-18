import React from 'react';

import phrases from '../../Phrases';


export default class LeagueStartForm extends React.Component {

  constructor(props) {
    super(props);
    const players = props.players.slice();
    players.sort((a, b) => {
      if (a.firstName < b.firstName) {
        return -1;
      } else if (a.firstName > b.firstName) {
        return 1;
      }
      return 0;
    });
    this.state = {
      raceTo: 1,
      groupNames: {
        A: '',
        B: '',
        C: '',
        D: '',
      },
      players,
      handicapErrors: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.adjustRaceTo = this.adjustRaceTo.bind(this);
    this.adjustHandicap = this.adjustHandicap.bind(this);
    this.submit = this.submit.bind(this);
    this.mapPlayers = this.mapPlayers.bind(this);
  }

  mapPlayers() {
    const { players, handicapErrors } = this.state;
    const playerList = [];
    players.forEach((player, idx) => {
      const error = handicapErrors.find(id => player.id === id);
      let input;
      if (this.props.gameType === '4') {
        input = <input type="number" min="0" style={{ maxWidth: '50px' }} onChange={e => this.adjustStraightPoolHandicap(idx, e.target.value)} value={player.handicap} />;
      } else {
        input = <span><button className="btn btn-sm" onClick={() => this.adjustHandicap(idx, 1)}>+</button>{` ${player.handicap} `}<button className="btn btn-sm" onClick={() => this.adjustHandicap(idx, -1)}>{phrases.general.ndash}</button></span>;
      }
      playerList.push((<li className={error ? 'list-group-item error' : 'list-group-item'} key={player.id}> {`${player.firstName} ${player.lastName}`}<span className="right">{`${phrases.general.handicap}: `}{input}</span></li>));
    });
    return <ul className="list-group" > {playerList}</ul>;
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    const { groupNames } = this.state;
    groupNames[name] = value;
    this.setState({ groupNames });
  }

  adjustStraightPoolHandicap(idx, value) {
    const { players, raceTo } = this.state;
    let { handicapErrors } = this.state;
    if (!Number.isNaN(value)) {
      players[idx].handicap = Number(value);
      if (players[idx].handicap < 0) {
        players[idx].handicap = '0';
      }
      const playerId = handicapErrors.find(id => id === players[idx].id);
      if (players[idx].handicap >= raceTo) {
        if (!playerId) {
          handicapErrors.push(playerId);
        }
      } else if (playerId) {
        handicapErrors = handicapErrors.filter(id => id !== playerId);
      }
    }
    this.setState({ players, handicapErrors });
  }

  adjustHandicap(idx, value) {
    const { players, raceTo } = this.state;
    let { handicapErrors } = this.state;
    players[idx].handicap = Number(players[idx].handicap) + value;
    if (players[idx].handicap < 0) {
      players[idx].handicap = '0';
    }
    const playerId = handicapErrors.find(id => id === players[idx].id);
    if (players[idx].handicap >= raceTo) {
      if (!playerId) {
        handicapErrors.push(playerId);
      }
    } else if (playerId) {
      handicapErrors = handicapErrors.filter(id => id !== playerId);
    }
    this.setState({ players, handicapErrors });
  }

  adjustRaceTo(event) {
    const { value } = event.target;
    let { raceTo, handicapErrors } = this.state;
    if (Number.isNaN(value) || Number(value) < 1) {
      raceTo = 1;
    } else {
      raceTo = value;
      handicapErrors = [];
    }
    this.setState({ raceTo, handicapErrors });
  }

  submit() {
    const { players } = this.state;
    const handicapErrors = [];
    const raceTo = Number(this.state.raceTo);
    players.forEach((player) => {
      if (Number(player.handicap) >= raceTo) {
        handicapErrors.push(player.id);
      }
    });
    if (handicapErrors.length > 0) {
      this.setState({ handicapErrors });
    } else {
      this.props.startLeague(players, this.state.groupNames, raceTo);
    }
  }

  render() {
    const {
      A, B, C, D,
    } = this.state.groupNames;
    const players = this.mapPlayers();
    return (<div className="col-xs-12 well start-form">
      <h3>{phrases.leagueStartForm.leagueSettings}</h3>
      <div className="col-lg-5 col-xs-12">
        <div className="panel panel-default">
          <div className="panel-heading">
            {phrases.leagueStartForm.groupNamesHeading}
          </div>
          <div className="panel-body">
            <fieldset>
              <div className="form-group">
                <label htmlFor="A">
                  {`${phrases.general.group} A`}
                  <input className="form-control" name="A" onChange={this.handleInputChange} value={A} type="text" />
                </label>
                <label htmlFor="A">
                  {`${phrases.general.group} B`}
                  <input className="form-control" name="B" onChange={this.handleInputChange} value={B} type="text" />
                </label>
                <label htmlFor="A">
                  {`${phrases.general.group} C`}
                  <input className="form-control" name="C" onChange={this.handleInputChange} value={C} type="text" />
                </label>
                <label htmlFor="A">
                  {`${phrases.general.group} D`}
                  <input className="form-control" name="D" onChange={this.handleInputChange} value={D} type="text" />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <div className="form-group">
                <label htmlFor="raceTo">
                  {phrases.leagueStartForm.raceTo}
                  <input type="number" style={{ maxWidth: '75px' }} className="form-control" onChange={this.adjustRaceTo} value={this.state.raceTo} min="1" />
                </label>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
      <div className="col-lg-6 col-xs-12">
        <div className="panel panel-default">
          <div className="panel-heading">
            {phrases.leagueStartForm.playerHandicaps} <span className="right">{`${this.state.players.length}/32`}</span>
            <span className="right error-message">
              {this.state.handicapErrors.length > 0 ? phrases.errorMessages.handicapError : ''}
            </span>
          </div>
          <div className="panel-body" >
            {players}
          </div>
        </div>
      </div>
      <div className="col-xs-12">
        <button className="btn btn-primary" onClick={this.submit}>{phrases.leagueStartForm.startLeague} </button>
      </div>
    </div>);
  }

}
