import React from 'react';
import phrases from '../../Phrases';
import Icons from './Icons';

export default class UndeterminedRankingsForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.mapUndetermined = this.mapUndetermined.bind(this);
    this.changeRanking = this.changeRanking.bind(this);
  }

  componentWillMount() {
    this.setState({ loading: true });
    this.props.getUndetermined();
  }

  componentWillReceiveProps(props) {
    if (props.undetermined) {
      const groups = {};
      props.undetermined.forEach((group) => {
        groups[group.id] = {
          id: group.id, key: group.group_key, players: [], minRanking: Number(group.ranking),
        };
        const players = group.players.split(',');
        players.forEach((player) => {
          const p = this.props.players.find(pl => pl.id === player);
          groups[group.id].players.push({ details: p, ranking: Number(group.ranking) });
          groups[group.id].maxRanking = Number(groups[group.id].minRanking) + (groups[group.id].players.length - 1);
        });
      });
      this.setState({ groups, loading: false });
    }
  }

  changeRanking(value, player, groupId) {
    player.ranking = Number(value);
    this.state.groups[groupId].error = false;
    this.setState({ ...this.state });
  }

  submitUndetermined(groupId) {
    const { groups } = this.state;
    const group = groups[groupId];
    let valid = true;
    const ranks = {};
    group.players.forEach((player) => {
      if (player.ranking < group.minRanking || player.ranking > group.maxRanking) {
        valid = false;
      }
      ranks[player.ranking] = 0;
    });
    if (Object.keys(ranks).length !== group.players.length) {
      valid = false;
    }
    if (valid) {
      this.props.updateUndetermined(group);
      this.setState({ loading: true });
    } else {
      group.error = true;
      this.setState({ groups });
    }
  }

  mapUndetermined() {
    const divs = [];
    if (this.state.groups) {
      const groupKeys = Object.keys(this.state.groups);
      groupKeys.forEach((key) => {
        const group = this.state.groups[key];
        const list = [];
        group.players.forEach((player) => {
          list.push(<div key={player.details.id} className="col-xs-12">
            <label htmlFor={`${group.id}-${player.details.id}`} className="col-xs-12">{`${player.details.firstName} ${player.details.lastName}`}
              <div className="col-xs-offset-1 col-xs-2">{phrases.general.place}:</div>
              <div className="col-xs-3">
                <input className="form-control" type="number" onChange={(e) => { this.changeRanking(e.target.value, player, group.id); }} min={group.minRanking} max={group.maxRanking} value={player.ranking} />
              </div>
            </label>
          </div>);
        });
        const div = (<div key={group.id} className="col-lg-5">
          <div className="panel panel-default">
            <div className="panel-heading">{`${phrases.general.group} ${group.key}`}<span className="right error-message">{group.error ? phrases.errorMessages.fixRankings : ''} </span></div>
            <div className="panel-body">
              {list}
            </div>
            <div className="panel-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
              this.submitUndetermined(group.id);
            }}
              >{phrases.general.submit}</button>
            </div>
          </div>
        </div>);
        divs.push(div);
      });
      if (divs.length === 0) {
        divs.push(<div key="no-ud"><p className="lead">{phrases.adminView.noUndetermined} </p></div>);
      }
    }
    return divs;
  }

  render() {
    const undetermined = this.mapUndetermined();
    return (
      <div className="col-lg-12 col-xs-12 well">
        <h2>{phrases.adminView.undeterminedRankingsHeading}</h2>
        <div>
          {this.state.loading ? <Icons type="LOADING" size="40px" /> : undetermined }
        </div>
      </div>
    );
  }

}
