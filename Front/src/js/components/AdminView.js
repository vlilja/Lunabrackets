import React from "react";
import phrases from "../../Phrases";
import helper from "../classes/helper";
import Icons from "./Icons";
import _ from "lodash";

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
      loading: false,
      invalidHandicaps: []
    }
    this.setGameName = this.setGameName.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.startLeague = this.startLeague.bind(this);
    this.submitUndetermined = this.submitUndetermined.bind(this);
    this.mapPlayers = this.mapPlayers.bind(this);
    this.mapUndetermined = this.mapUndetermined.bind(this);
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
    var value = this.validateInput(name, target.value);
    if (name.match(/one|two|three|four/g)) {
      this.setState({
        groups: {
          ...this.state.groups,
          [name]: value
        }
      });
    }
    else if(name.match(/[A|B|C|Ð]-undetermined-./g)) {
      var groupKey = name.charAt(0);
      var group = this.state.undetermined[groupKey];
      var playerId = name.split('-').pop();
      if(!value || value < group.minRanking || value > group.maxRanking){
        value = group.minRanking;
      }
      group.players[playerId].ranking=value;
      this.setState({
        ...this.state.undetermined, [groupKey]:group
      })
    }
    else {
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
    if (this.props.league && this.props.league.stage === 'qualifiers') {
      this.setState({loading:true});
      this.props.getUndetermined();
    }
  }

  componentWillReceiveProps(props) {
    if(props.league && props.league.undetermined && !this.state.undetermined) {
      var undetermined = props.league.undetermined.slice();
      var undeterminedByGroup = {}
      undetermined.forEach((undetermined) => {
        var players = undetermined.players.split(',');
        undeterminedByGroup = {...undeterminedByGroup, [undetermined.group_key]:{minRanking:Number(undetermined.ranking), maxRanking:(Number(undetermined.ranking)+players.length-1), players:{}}};
        for (var i = 0; i < players.length; i++) {
          undeterminedByGroup[undetermined.group_key].players[players[i]] = {ranking:undetermined.ranking};
        }
      })
      this.setState({undetermined: undeterminedByGroup, loading:false});
    }
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

  submitUndetermined(groupKey) {
    var group = this.state.undetermined[groupKey];
    var groupByRank = _.groupBy(group.players, 'ranking');
    var invalid = false;
    if(Object.keys(groupByRank).length === 3){
      for(var player in group.players) {
        if(group.players[player].ranking < group.minRanking || group.players[player].ranking > group.maxRanking) {
          invalid = true;
        }
      }
    }
    else {
      invalid = true;
    }
    if(invalid) {
      console.log('invalid');
    }
    else {
      this.setState({loading:true, undetermined:null});
      this.props.updateUndetermined({key:groupKey, players:group.players});
    }
    _
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

  mapUndetermined() {
    if (this.state.undetermined) {
      var groups = Object.keys(this.state.undetermined);
      var divs = [];
      groups.forEach((group) => {
        var players = Object.keys(this.state.undetermined[group].players);
        var list = [];
        for (var i = 0; i < players.length; i++) {
          var player = this.state.players.find((player) => {
            return players[i] === player.player_id;
          })
          list.push(
            <div key={group + i} class="col-xs-12">
              <label class="col-xs-5">{player.firstName + " " + player.lastName}</label>
              <div class="col-xs-offset-1 col-xs-2">{phrases.general.ranking}:</div>
              <div class="col-xs-3">
                <input class="form-control" type="number" name={group+'-undetermined-'+players[i]} min={this.state.undetermined[group].minRanking} onChange={this.handleInputChange} max={this.state.undetermined[group].maxRanking} value={this.state.undetermined[group].players[players[i]].ranking}></input>
              </div>
            </div>
          );
        }
        var div = <div key={group} class="col-lg-5">
          <div class="panel panel-default">
            <div class="panel-heading">{phrases.general.group + " " + group}</div>
            <div class="panel-body">
              {list}
            </div>
            <div class="panel-footer">
              <button class="btn btn-primary" onClick={()=>{this.submitUndetermined(group)}} >{phrases.general.submit}</button>
            </div>
          </div>
        </div>
        divs.push(div);
      })
      return divs;
    }
  }

  render() {
    const mappedPlayers = this.mapPlayers();
    const mappedUndetermined = this.mapUndetermined();
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
          <h2>{phrases.adminView.undeterminedRankingsHeading}</h2>
          {this.state.loading ? <Icons type="LOADING" size="32px" /> : mappedUndetermined}
        </div>
      </div>
    )
  }

}
