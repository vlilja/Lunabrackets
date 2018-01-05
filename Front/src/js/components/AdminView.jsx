import React from 'react';
import _ from 'lodash';

import phrases from '../../Phrases';
import helper from '../helpers/helper';

import UndeterminedRankingsForm from './UndeterminedRankingsForm';

export default class AdminView extends React.Component {

  constructor(props) {
    super(props);
    const players = props.league.players.slice();
    this.state = {
      gameName: '',
      raceTo: '1',
      groups: {
        one: '',
        two: '',
        three: '',
        four: '',
      },
      players,
      loading: false,
      invalidHandicaps: [],
    };
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

  componentWillMount() {
    this.setGameName(this.props.league.game);
  }

  componentWillReceiveProps(props) {
    if (props.league && props.league.undetermined && !this.state.undetermined) {
      const undetermined = props.league.undetermined.slice();
      let undeterminedByGroup = {};
      undetermined.forEach((ud) => {
        const players = ud.players.split(',');
        undeterminedByGroup = {
          ...undeterminedByGroup,
          [ud.group_key]: {
            maxRanking: (Number(ud.ranking) - (players.length - 1)),
            minRanking: (Number(ud.ranking)),
            players: {},
          },
        };
        for (let i = 0; i < players.length; i += 1) {
          undeterminedByGroup[ud.group_key].players[players[i]] = {
            ranking: ud.ranking,
          };
        }
      });
      this.setState({ undetermined: undeterminedByGroup, loading: false });
    }
  }

  setGameName(gameId) {
    this.setState({ gameName: helper.determineGameName(gameId) });
  }

  handleInputChange(event) {
    const { target } = event;
    const { name } = target;
    let value = this.validateInput(name, target.value);
    if (name.match(/one|two|three|four/g)) {
      this.setState({
        groups: {
          ...this.state.groups,
          [name]: value,
        },
      });
    } else if (name.match(/[A|B|C|Ð]-undetermined-./g)) {
      const groupKey = name.charAt(0);
      const group = this.state.undetermined[groupKey];
      const playerId = name.split('-').pop();
      if (!value || value < group.minRanking || value > group.maxRanking) {
        value = group.minRanking;
      }
      group.players[playerId].ranking = value;
      this.setState({
        ...this.state.undetermined,
        [groupKey]: group,
      });
    } else {
      this.setState({ [name]: value });
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

  adjustHandicap(idx, sign) {
    const { players } = this.state;
    let number = Number(players[idx].handicap);
    const raceTo = Number(this.state.raceTo);
    if (sign === '+' && number < raceTo - 1) {
      number += 1;
    } else if (sign === '-' && number > 0) {
      number -= 1;
    }
    this.markInvalidHandicap(idx, number, raceTo);
    players[idx].handicap = number.toString();
    this.setState({
      ...this.state,
      players,
    });
  }

  markInvalidHandicap(idx, number, raceTo) {
    const index = this.state.invalidHandicaps.findIndex(item => item === idx);
    if (number > raceTo - 1 || number < 0) {
      if (index === -1) {
        this.state.invalidHandicaps.push(idx);
      }
    } else {
      this.state.invalidHandicaps.splice(index, 1);
    }
  }

  startLeague() {
    const raceTo = Number(this.state.raceTo);
    let invalid = false;
    this.state.players.forEach((player, idx) => {
      const num = Number(player.handicap);
      this.markInvalidHandicap(idx, num, raceTo);
    });
    const groupKeys = Object.keys(this.state.group);
    groupKeys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(this.state.group, key)) {
        if (!this.state.groups[key]) {
          invalid = true;
        }
      }
    });
    if (this.state.invalidHandicaps.length === 0 && !invalid) {
      this.props.startLeague(this.state.players, this.state.groups, this.state.raceTo);
    }
    this.setState({
      ...this.state,
    });
  }

  submitUndetermined(groupKey) {
    let invalid = false;
    const group = this.state.undetermined[groupKey];
    const groupByRank = _.groupBy(group.players, 'ranking');
    const rankKeys = Object.keys(groupByRank);
    const playerKeys = Object.keys(group.players);
    if (rankKeys.length !== playerKeys.length) {
      invalid = true;
    }
    playerKeys.forEach((key) => {
      if (group.players[key].ranking < group.minRanking || group.players[key].ranking > group.maxRanking) {
        invalid = true;
      }
    });
    if (!invalid) {
      this.setState({ loading: true, undetermined: null });
      this.props.updateUndetermined({ key: groupKey, players: group.players });
    }
  }

  mapPlayers() {
    const invalidHandicap = {
      backgroundColor: 'pink',
    };
    return this.state.players.map((player, idx) => {
      const index = this.state.invalidHandicaps.findIndex(item => item === idx);
      return (<li
        className="list-group-item"
        style={index !== -1
        ? invalidHandicap
        : {}}
        key={player.id}
      >{`${player.firstName} ${player.lastName}`}
        <span style={{
          float: 'right',
        }}
        >{`${phrases.general.handicap}: `}
          <button
            style={{
            minWidth: '25px',
          }}
            onClick={() => {
            this.adjustHandicap(idx, '+');
          }}
            className="btn btn-xs"
          >+</button>
          <span className="margin-left margin-right">{player.handicap}</span>
          <button
            style={{
            minWidth: '25px',
          }}
            className="btn btn-xs"
            onClick={() => {
            this.adjustHandicap(idx, '-');
          }}
          >-</button>
        </span>
      </li>);
    });
  }

  render() {
    const mappedPlayers = this.mapPlayers();
    return (
      <div>
        <div className="col-lg-3 col-xs-12">
          <div className="panel panel-default">
            <div className="panel-heading">{phrases.adminView.leaguePanelHeading}</div>
            <div className="panel-body">
              <div className="form-group">
                <label>{`${phrases.general.game}: ${this.state.gameName}`}</label><br />
                <label>{`${phrases.general.stage}: ${this.props.league.stage}`}</label><br />
                <label>{`${phrases.general.players}: ${this.props.league.players.length} / 32`}</label><br />
                <label className="margin-right" htmlFor="raceTo">{`${phrases.general.raceTo}: `}</label>
                {this.props.league.stage === 'ready'
                  ? <input
                    type="number"
                    min="1"
                    onChange={this.handleInputChange}
                    name="raceTo"
                    style={{
                      maxWidth: '45px',
                    }}
                    value={this.state.raceTo}
                  />
                  : 'RACETO'}</div>
              {phrases.adminView.groupsHeading}
              <hr style={{
                marginTop: '0px',
              }}
              />

              <div className="form-group">
                <label htmlFor="one">Group 1</label>
                <input className="form-control" onChange={this.handleInputChange} value={this.state.groups.one} name="one" type="text" />
                <label htmlFor="two">Group 2</label>
                <input className="form-control" onChange={this.handleInputChange} value={this.state.groups.two} name="two" type="text" />
                <label htmlFor="three">Group 3</label>
                <input className="form-control" onChange={this.handleInputChange} value={this.state.groups.three} name="three" type="text" />
                <label htmlFor="four">Group 4</label>
                <input className="form-control" onChange={this.handleInputChange} value={this.state.groups.four} name="four" type="text" />
              </div>
            </div>
            <div className="panel-footer">
              {this.props.league.stage === 'ready'
                ? <button className="btn btn-primary" onClick={this.startLeague}>{phrases.adminView.start}</button>
                : <button className="btn btn-primary" disabled>{phrases.adminView.start}</button>}
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-xs-12">
          <div className="panel panel-default">
            <div className="panel-heading">{phrases.adminView.handicapHeading}
              <span style={{
                float: 'right',
                color: 'red',
              }}
              >{this.state.invalidHandicaps.length > 0
                  ? `!${phrases.errorMessages.handicapError}`
                  : ''}</span>
            </div>
            <div className="panel-body">
              <ul className="list-group scrollable">
                {mappedPlayers}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-xs-12">
          {this.props.league.stage === 'qualifiers' ? <UndeterminedRankingsForm updateUndetermined={this.props.updateUndetermined} players={this.props.league.players} getUndetermined={this.props.getUndetermined} undetermined={this.props.league.undetermined} /> : ''}
        </div>
      </div>
    );
  }

}
