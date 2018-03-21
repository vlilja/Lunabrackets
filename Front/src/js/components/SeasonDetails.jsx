import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Icons from './Icons';
import { getSeason, getSeasonResults } from '../actions/seasonActions';
import { getAllPlayers } from '../actions/playerActions';
import phrases from '../../Phrases';
import helper from '../helpers/helper';

class SeasonDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      seasonFetched: false,
      resultsFetched: false,
      playersFetched: false,
    };
    this.mapSeason = this.mapSeason.bind(this);
  }

  componentWillMount() {
    if (this.props.user.token) {
      this.props.dispatch(getSeason(this.props.match.params.id, this.props.user));
      this.setState({ seasonFetched: true });
    }
    if (!this.props.players.length > 0 && this.props.user.token) {
      this.props.dispatch(getAllPlayers(this.props.user));
      this.setState({ playersFetched: true });
    }
  }

  componentWillReceiveProps(props) {
    if (!this.state.seasonFetched && props.user.token) {
      this.props.dispatch(getSeason(this.props.match.params.id, props.user));
      this.setState({ seasonFetched: true });
    }
    if (!this.state.resultsFetched && props.season && props.user.token) {
      this.props.dispatch(getSeasonResults(props.season.leagues, props.season.tournaments, props.user));
      this.setState({ resultsFetched: true });
    }
    if (!this.state.playersFetched && props.user.token) {
      this.props.dispatch(getAllPlayers(props.user));
      this.setState({ playersFetched: true });
    }
  }

  mapSeason() {
    let element;
    if (this.props.season && this.props.players.length > 0) {
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
    const table = { header: null, body: null };
    if (this.props.season && this.props.season.results) {
      const players = {};
      const { results } = this.props.season;
      const leagueKeys = [];
      const tournamentKeys = [];
      results.leagues.forEach((league) => {
        leagueKeys.push(league.id);
        league.results.forEach((result) => {
          if (players[result.player_id]) {
            players[result.player_id].leagues[league.id] = { points: result.points, bonus: result.bonus };
          } else {
            const playerDetails = this.props.players.find(p => p.id === result.player_id);
            players[result.player_id] = { details: playerDetails, leagues: {} };
            players[result.player_id].leagues[league.id] = { points: result.points, bonus: result.bonus };
          }
        });
      });
      results.tournaments.forEach((tournament) => {
        tournamentKeys.push(tournament.id);
        tournament.results.forEach((result) => {
          if (players[result.player_id]) {
            if (!players[result.player_id].tournaments) {
              players[result.player_id].tournaments = {};
            }
            players[result.player_id].tournaments[tournament.id] = { points: result.points };
          } else {
            const playerDetails = this.props.players.find(p => p.id === result.player_id);
            players[result.player_id] = { details: playerDetails, tournaments: {} };
            players[result.player_id].tournaments[tournament.id] = { points: result.points };
          }
        });
      });
      const playersKeys = Object.keys(players);
      const playersArr = [];
      playersKeys.forEach((key) => {
        let sum = 0;
        let bonus = 0;
        leagueKeys.forEach((leagueKey) => {
          if (players[key].leagues && players[key].leagues[leagueKey]) {
            const { points } = players[key].leagues[leagueKey];
            sum += Number(points);
            if (players[key].leagues[leagueKey].bonus === '1') {
              bonus += 4;
              sum += 4;
            }
          }
        });
        tournamentKeys.forEach((tournamentKey) => {
          if (players[key].tournaments && players[key].tournaments[tournamentKey]) {
            const { points } = players[key].tournaments[tournamentKey];
            sum += Number(points);
          }
        });
        players[key].sum = sum;
        players[key].bonus = bonus;
        playersArr.push(players[key]);
      });
      playersArr.sort(helper.sortSeasonRanking);
      // Table header
      const tableHeader = [];
      const headerRow = [];
      headerRow.push(<th key="corner" />);
      this.props.season.leagues.forEach((league) => {
        headerRow.push(<th className="center-text" key={league.id}>{league.name}</th>);
      });
      this.props.season.tournaments.forEach((tournament, idx) => {
        headerRow.push(<th
          className={idx === 0 ? 'center-text left-border' : 'center-text'}
          key={tournament.id}
        >{tournament.name}</th>);
      });
      headerRow.push(<th className="center-text left-border" key="bns">{phrases.season.bonus}</th>);
      headerRow.push(<th className="center-text" key="sum">{phrases.season.sum}</th>);
      tableHeader.push(<tr key="header">{headerRow}</tr>);
      table.header = tableHeader;
      // Table body
      const tableBody = [];
      playersArr.forEach((player, idx) => {
        const tableRow = [];
        tableRow.push(<td
          className="name-cell"
          key={player.details.id}
        >{`${idx + 1}.  ${player.details.firstName} ${player.details.lastName}` }</td>);
        leagueKeys.forEach((leagueKey) => {
          let pts = '-';
          if (player.leagues && player.leagues[leagueKey]) {
            pts = player.leagues[leagueKey].points;
          }
          tableRow.push(<td key={leagueKey + player.details.id} className="center-text">{pts}</td>);
        });
        tournamentKeys.forEach((tournamentKey, index) => {
          let pts = '-';
          if (player.tournaments && player.tournaments[tournamentKey]) {
            pts = player.tournaments[tournamentKey].points;
          }
          tableRow.push(<td
            key={tournamentKey + player.details.id}
            className={index === 0 ? 'center-text left-border' : 'center-text'}
          >{pts}</td>);
        });
        tableRow.push(<td className="center-text left-border" key="bns">{player.bonus || ''}</td>);
        tableRow.push(<td className="center-text sum-cell" key="sum">{player.sum}</td>);
        tableBody.push(<tr key={player.details.id}>{tableRow}</tr>);
        table.body = tableBody;
      });
    }
    return table;
  }

  render() {
    const season = this.mapSeason();
    const table = this.mapResults();
    return (
      <div className="col-xs-12">
        {season && table ?
          <div>
            <div className="col-xs-12 col-lg-4">{season}</div>
            <div className="col-xs-12 col-lg-8 margin-top-double">
              {table.header ?
                <table className="table table-hover season-results">
                  <thead>
                    {table.header}
                  </thead>
                  <tbody>
                    {table.body}
                  </tbody>
                </table>
              : <div className="margin-top-double"><Icons type="LOADING" size="40px" /></div>}
            </div>
          </div>
        : <Icons type="LOADING" size="40px" />}
      </div>
    );
  }
}

export default connect(store => ({
  user: store.user,
  season: store.season.selectedSeason,
  players: store.player.playerList,
  loading: store.season.loading,
}))(SeasonDetails);
