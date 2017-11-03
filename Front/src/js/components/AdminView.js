import React from "react";
import phrases from "../../Phrases";
import helper from "../classes/helper";

export default class AdminView extends React.Component {

  constructor(props) {
    super(props);
    var players = props.league.participants.slice();
    this.state = {
      gameName: '',
      raceTo: '1',
      groups: {
        one: '',
        two: '',
        three: '',
        four: ''
      },
      players: players,
      invalidHandicaps: []
    }
    this.setGameName = this.setGameName.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.startLeague = this.startLeague.bind(this);
    this.mapPlayers = this.mapPlayers.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.adjustHandicap = this.adjustHandicap.bind(this);
    this.markInvalidHandicap = this.markInvalidHandicap.bind(this);
  }

  setGameName(gameId) {
    this.setState({gameName: helper.determineGameName(gameId)});
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = this.validateInput(name, target.value);
    if (name === 'one' || name === 'two' || name === 'three' || name === 'four') {
      this.setState({
        groups: {
          ...this.state.groups,
          [name]: value
        }
      });
    } else {
      this.setState({[name]: value});
    }
  }

  validateInput(name, value) {
    if (name === 'raceTo') {
      if (!value || value < 1) {
        value = 1;
      }
    }
    return value;
  }

  componentWillMount() {
    this.setGameName(this.props.league.game);
  }

  adjustHandicap(idx, sign) {
    var players = this.state.players;
    var number = Number(players[idx].handicap);
    var raceTo = Number(this.state.raceTo);
    if (sign === '+' && number < raceTo - 1) {
      number += 1;
    } else if (sign === '-' && number > 0) {
      number -= 1;
    }
    this.markInvalidHandicap(idx, number, raceTo);
    players[idx].handicap = number.toString();
    this.setState({
      ...this.state,
      players: players
    });
  }

  markInvalidHandicap(idx, number, raceTo) {
    var index = this.state.invalidHandicaps.findIndex((item) => {
      return item === idx;
    });
    if (number > raceTo - 1 || number < 0) {
      if (index === -1) {
        this.state.invalidHandicaps.push(idx);
      }
    } else {
      this.state.invalidHandicaps.splice(index, 1);
    }
  }

  startLeague() {
    var raceTo = Number(this.state.raceTo);
    var invalid = false;
    this.state.players.forEach((player, idx) => {
      var num = Number(player.handicap)
      this.markInvalidHandicap(idx, num, raceTo);
    })
    for (var property in this.state.group) {
      if (this.state.groups.hasOwnProperty(property)) {
        if (!this.state.groups[property]) {
          invalid = true;
        }
      }
    }
    if (this.state.invalidHandicaps.length === 0 && !invalid) {
      this.props.startLeague(this.state.players, this.state.groups, this.state.raceTo);
    }
    this.setState({
      ...this.state
    })
  }

  mapPlayers() {
    var invalidHandicap = {
      backgroundColor: 'pink'
    }
    return this.state.players.map((player, idx) => {
      var index = this.state.invalidHandicaps.findIndex((item) => {
        return item === idx;
      });
      return <li class="list-group-item" style={index !== -1
        ? invalidHandicap
        : {}} key={idx}>{player.firstName + ' ' + player.lastName}
        <span style={{
          float: 'right'
        }}>{phrases.general.handicap + ': '}
          <button style={{
            minWidth: '25px'
          }} onClick={() => {
            this.adjustHandicap(idx, '+')
          }} class="btn btn-xs">+</button>
          <span class="margin-left margin-right">{player.handicap}</span>
          <button style={{
            minWidth: '25px'
          }} class="btn btn-xs" onClick={() => {
            this.adjustHandicap(idx, '-')
          }}>-</button>
        </span>
      </li>
    })
  }

  render() {
    const mappedPlayers = this.mapPlayers();
    return (
      <div>
        <div class="col-lg-3 col-xs-12">
          <div class="panel panel-default">
            <div class="panel-heading">{phrases.adminView.leaguePanelHeading}</div>
            <div class="panel-body">
              <div class="form-group">
                <label>{phrases.general.game + ': ' + this.state.gameName}</label><br/>
                <label>{phrases.general.stage + ': ' + this.props.league.stage}</label><br/>
                <label>{phrases.general.players + ': ' + this.props.league.participants.length + " / 32"}</label><br/>
                <label class="margin-right" for="raceTo">{phrases.general.raceTo + ": "}</label>
                {this.props.league.stage === 'ready'
                  ? <input type="number" min="1" onChange={this.handleInputChange} name="raceTo" style={{
                      maxWidth: '45px'
                    }} value={this.state.raceTo}></input>
                  : 'RACETO'}</div>
              {phrases.adminView.groupsHeading}
              <hr style={{
                marginTop: '0px'
              }}/>

              <div class="form-group">
                <label for="one">Group 1</label>
                <input class="form-control" onChange={this.handleInputChange} value={this.state.groups.one} name="one" type="text"></input>
                <label for="two">Group 2</label>
                <input class="form-control" onChange={this.handleInputChange} value={this.state.groups.two} name="two" type="text"></input>
                <label for="three">Group 3</label>
                <input class="form-control" onChange={this.handleInputChange} value={this.state.groups.three} name="three" type="text"></input>
                <label for="four">Group 4</label>
                <input class="form-control" onChange={this.handleInputChange} value={this.state.groups.four} name="four" type="text"></input>
              </div>
            </div>
            <div class="panel-footer">
              {this.props.league.stage === 'ready'
                ? <button class="btn btn-primary" onClick={this.startLeague}>{phrases.adminView.start}</button>
                : <button class="btn btn-primary" disabled>{phrases.adminView.start}</button>}
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-xs-12">
          <div class="panel panel-default">
            <div class="panel-heading">{phrases.adminView.handicapHeading}
              <span style={{
                float: 'right',
                color: 'red'
              }}>{this.state.invalidHandicaps.length > 0
                  ? '!' + phrases.errorMessages.handicapError
                  : ''}</span>
            </div>
            <div class="panel-body">
              <ul class="list-group scrollable">
                {mappedPlayers}
              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-12">
        </div>
      </div>
    )
  }

}
