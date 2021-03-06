import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { getAllLeagues, getLeague } from '../actions/leagueActions';
import LeaguePanel from './LeaguePanel';
import Icons from './Icons';
import phrases from '../../Phrases';


class LeagueList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
    };
    this.navigateTo = this.navigateTo.bind(this);
  }

  componentWillMount() {
    if (!this.props.leagues && this.props.user.id) {
      this.props.dispatch(getAllLeagues(this.props.user));
      this.setState({ initialized: true });
    }
  }

  componentWillReceiveProps(props) {
    if (!this.state.initialized && props.user.token) {
      this.props.dispatch(getAllLeagues(props.user));
      this.setState({ initialized: true });
    }
  }

  navigateTo(leagueId) {
    this.props.history.push(`${this.props.match.path}/${leagueId}`);
  }

  selectLeague(leagueId) {
    this.props.dispatch(getLeague(leagueId));
  }

  render() {
    let mappedLeagues;
    if (this.props.leagues) {
      mappedLeagues = this.props.leagues.map(league => (<div
        className="col-lg-3 col-xs-6"
        key={league.id}
      ><LeaguePanel navigateTo={this.navigateTo} league={league} /></div>));
    }
    return (
      <Router>
        <div className="container">
          <h2>{phrases.navigation.leagues}</h2>
          {this.props.loading
            ? <Icons type="LOADING" size="40px" />
            : mappedLeagues}
        </div>
      </Router>
    );
  }

}

export default connect(store => ({
  user: store.user,
  leagues: store.league.leagueList,
  loading: store.league.loading.list,
}))(LeagueList);
