import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSeason, getSeasonResults } from '../actions/seasonActions';
import helper from '../helpers/helper';

class SeasonDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.mapSeason = this.mapSeason.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getSeason(this.props.match.params.id));
  }

  componentWillReceiveProps(props) {
    if (props.season && !props.season.results) {
      this.props.dispatch(getSeasonResults(props.season.leagues));
    }
  }

  mapSeason() {
    let element;
    if (this.props.season) {
      const { season } = this.props;
      const leagues = [];
      season.leagues.forEach((league) => {
        leagues.push(<li key={league.id} className="list-group-item">
          <Link to={`/leagues/${league.id}`}>
            <div>{league.name}</div>
            <div>{helper.determineGameName(league.game)}</div>
          </Link>
        </li>);
      });
      element = (<div>
        <h2>{season.name}</h2>
        <div>
          <ul className="list-group">{leagues}</ul>
        </div>
      </div>);
    }
    return element;
  }

  mapResults() {
    if (this.props.season && this.props.season.results) {
      const players = {};
      const { results } = this.props.season;
      results.forEach((resultSet) => {
        resultSet.results.forEach((result) => {
          if (players[result.player_id]) {
            players[result.player_id][resultSet.id] = result.points;
          } else {
            players[result.player_id] = {};
            players[result.player_id][resultSet.id] = result.points;
          }
        });
      });
      // Table header
      const tableHeader = [];
      tableHeader.push(<th key="corner" />);
      this.props.season.leagues.forEach((league) => {
        tableHeader.push(<th key={league.id}>{league.name}</th>);
      });
      tableHeader.push(<th key="sum" />);
      // Table body
      const tableBody = [];
    }
  }

  render() {
    console.log(this.props);
    const season = this.mapSeason();
    const results = this.mapResults();
    return (
      <div className="col-xs-12">
        <div className="col-xs-6 col-lg-4">{season}</div>
        <div className="col-xs-6 col-lg-4">{results}</div>
      </div>
    );
  }
}

export default connect(store => ({
  season: store.season.selectedSeason,
  loading: store.season.loading,
}))(SeasonDetails);
