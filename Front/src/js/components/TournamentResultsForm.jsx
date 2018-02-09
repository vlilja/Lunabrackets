import React from 'react';
import _ from 'lodash';

import phrases from '../../Phrases';


export default class TournamentResultsForm extends React.Component {

  constructor(props) {
    const availablePlayers = props.players.slice();
    super(props);
    this.state = {
      availablePlayers,
      pickedPlayers: [],
      error: false,
    };
    this.renderPlayerLists = this.renderPlayerLists.bind(this);
    this.moveToPicked = this.moveToPicked.bind(this);
    this.moveToAvailable = this.moveToAvailable.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.players) {
      let availablePlayers = props.players.slice();
      availablePlayers = _.orderBy(availablePlayers, ['firstName', 'lastName'], ['asc', 'asc']);
      this.setState({ availablePlayers });
    }
  }

  onChange(val, id) {
    const value = Number(val);
    const { pickedPlayers } = this.state;
    if (value >= 1 && value <= 16) {
      const player = pickedPlayers.find(p => p.id === id);
      player.ranking = value;
      this.setState({ pickedPlayers, error: false });
    }
  }

  moveToPicked(id) {
    let { availablePlayers, pickedPlayers } = this.state;
    if (pickedPlayers.length < 16) {
      const player = availablePlayers.find(p => p.id === id);
      player.ranking = 0;
      pickedPlayers.push(player);
      pickedPlayers = _.orderBy(pickedPlayers, ['firstName', 'lastName'], ['asc', 'asc']);
      availablePlayers = availablePlayers.filter(p => p.id !== id);
      this.setState({ availablePlayers, pickedPlayers });
    }
  }

  moveToAvailable(id) {
    let { availablePlayers, pickedPlayers } = this.state;
    const player = pickedPlayers.find(p => p.id === id);
    player.ranking = 0;
    availablePlayers.push(player);
    availablePlayers = _.orderBy(availablePlayers, ['firstName', 'lastName'], ['asc', 'asc']);
    pickedPlayers = pickedPlayers.filter(p => p.id !== id);
    this.setState({ availablePlayers, pickedPlayers });
  }

  submit() {
    const { pickedPlayers } = this.state;
    if (pickedPlayers.length <= 16) {
      const places = [];
      const rankedPlayers = [];
      pickedPlayers.forEach((p, idx) => {
        places.push(idx + 1);
        rankedPlayers.push({ playerId: p.id, place: p.ranking });
      });
      rankedPlayers.sort((a, b) => a.place - b.place);
      let valid = true;
      for (let i = 0; i < rankedPlayers.length; i += 1) {
        if (places[i] !== rankedPlayers[i].place) {
          valid = false;
        }
      }
      if (valid) {
        console.log(rankedPlayers);
        this.props.createTournamentResults(rankedPlayers);
      } else {
        this.setState({ error: true });
      }
    }
  }

  renderPlayerLists() {
    const { availablePlayers, pickedPlayers } = this.state;
    const availablePlayersList = [];
    availablePlayers.forEach((player, idx) => {
      availablePlayersList.push(<div
        className="list-group-item"
        tabIndex={idx}
        role="button"
        onDoubleClick={() => { this.moveToPicked(player.id); }}
        key={player.id}
      >
        {`${player.firstName} ${player.lastName}`}
      </div>);
    });
    const pickedPlayersList = [];
    pickedPlayers.forEach((player, idx) => {
      pickedPlayersList.push(<div
        className="list-group-item"
        tabIndex={idx}
        role="button"
        onDoubleClick={(e) => {
            if (e.target.name !== 'input') {
              this.moveToAvailable(player.id);
            }
          }
        }
        key={player.id}
      >
        {`${player.firstName} ${player.lastName}`}
        <span className="right">
          <input
            name="input"
            type="number"
            min="1"
            max="16"
            onChange={(e) => { this.onChange(e.target.value, player.id); }}
            value={player.ranking}
          />
        </span>
      </div>);
    });
    return {
      available: <ul
        className="list-group scrollable pointer"
      >{availablePlayersList}</ul>,
      picked: <ul
        className="list-group scrollable pointer"
      >{pickedPlayersList}</ul>,
    };
  }

  render() {
    const { pickedPlayers, error } = this.state;
    const playerList = this.renderPlayerLists();
    return (<div>
      <div className="col-xs-6">
        <div className="well bs-component">
          <legend>
            {phrases.tournamentForm.availablePlayers}
          </legend>
          { playerList.available }
        </div>
      </div>
      <div className="col-xs-6">
        <div className="col-xs-12 well bs-component">
          <legend>{phrases.tournamentForm.selectedPlayers}
            <span className="right">
              <span className="error-message margin-right">{error ? phrases.errorMessages.fixSprintRankings : ''}</span>
              {`${pickedPlayers.length}/16`}
            </span>
          </legend>
          { playerList.picked }
          <div className="col-xs-12">
            <button onClick={this.submit} className="btn btn-primary">{phrases.general.submit}</button>
          </div>
        </div>
      </div>
    </div>);
  }
}
