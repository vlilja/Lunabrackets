import React from 'react';
import { connect } from 'react-redux';

import { getAllTournaments } from '../actions/tournamentActions';
import Icons from './Icons';
import phrases from '../../Phrases';

class TournamentList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
    };
    this.navigateTo = this.navigateTo.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  componentWillMount() {
    if (this.props.user.token) {
      this.props.dispatch(getAllTournaments(this.props.user));
      this.setState({ initialized: true });
    }
  }

  componentWillReceiveProps(props) {
    if (!this.state.initialized && props.user.token) {
      this.props.dispatch(getAllTournaments(props.user));
      this.setState({ initialized: true });
    }
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
    return (<div className="col-xs-12">
      <h2>{phrases.navigation.tournaments}</h2>
      {tournaments || <Icons type="LOADING" size="40px" />}
    </div>);
  }
}

export default connect(store => ({
  user: store.user,
  tournaments: store.tournament.tournaments,
}))(TournamentList);
