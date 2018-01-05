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
    if (props.undetermined && !this.state.groups) {
      const groups = {};
      props.undetermined.forEach((group) => {
        groups[group.group_key] = { key: group.group_key, players: [], minRanking: Number(group.ranking) };
        const players = group.players.split(',');
        players.forEach((player) => {
          const p = this.props.players.find(pl => pl.id === player);
          groups[group.group_key].players.push({ details: p, ranking: Number(group.ranking) });
          groups[group.group_key].maxRanking = Number(groups[group.group_key].minRanking) + (groups[group.group_key].players.length - 1);
        });
      });
      this.setState({ groups, loading: false });
    }
  }

  changeRanking(value, player) {
    player.ranking = Number(value);
    this.setState({ ...this.state });
  }

  submitUndetermined(group) {
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
      this.setState({ groups: null, loading: true });
    }
  }

  mapUndetermined() {
    const divs = [];
    if (this.state.groups) {
      const groups = Object.keys(this.state.groups);
      groups.forEach((group) => {
        const list = [];
        this.state.groups[group].players.forEach((player) => {
          list.push(<div key={group} className="col-xs-12">
            <label htmlFor={`${group}-${player.details.id}`} className="col-xs-5">{`${player.details.firstName} ${player.details.lastName}`}
              <div className="col-xs-offset-1 col-xs-2">{phrases.general.place}:</div>
              <div className="col-xs-3">
                <input className="form-control" type="number" name={`${group}-${player.details.id}`} onChange={(e) => { this.changeRanking(e.target.value, player); }} min={this.state.groups[group].minRanking} max={this.state.groups[group].maxRanking} value={player.ranking} />
              </div>
            </label>
          </div>);
        });
        const div = (<div key={group} className="col-lg-5">
          <div className="panel panel-default">
            <div className="panel-heading">{`${phrases.general.group} ${group}`}</div>
            <div className="panel-body">
              {list}
            </div>
            <div className="panel-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
              this.submitUndetermined(this.state.groups[group]);
            }}
              >{phrases.general.submit}</button>
            </div>
          </div>
        </div>);
        divs.push(div);
      });
    }
    return divs;
  }

  render() {
    const undetermined = this.mapUndetermined();
    return (
      <div className="col-lg-12 col-xs-12">
        <h2>{phrases.adminView.undeterminedRankingsHeading}</h2>
        <div>
          {this.state.loading ? <Icons type="LOADING" size="40px" /> : undetermined }
        </div>
      </div>
    );
  }

}
