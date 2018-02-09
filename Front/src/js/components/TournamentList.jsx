import React from 'react';
import { connect } from 'react-redux';

import { getAllTournaments } from '../actions/tournamentActions';
import Icons from './Icons';

class TournamentList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.navigateTo = this.navigateTo.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getAllTournaments());
  }

  navigateTo(id) {
    this.props.history.push(`${this.props.match.path}/${id}`);
  }

  renderList() {
    let tournaments = null;
    if (this.props.tournaments) {
      tournaments = [];
      this.props.tournaments.forEach((tournament) => {
        tournaments.push((<li key={tournament.id} className="list-group-item"><div tabIndex={tournament.id} role="button" onClick={() => { this.navigateTo(tournament.id); }}>{tournament.name}</div></li>));
      });
      tournaments = <ul className="list-group">{tournaments}</ul>;
    }
    return tournaments;
  }

  render() {
    const tournaments = this.renderList();
    return (<div className="col-xs-12"> {tournaments || <Icons type="LOADING" size="40px" />} </div>);
  }
}

export default connect(store => ({
  tournaments: store.tournament.tournaments,
}))(TournamentList);
