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
    this.mapSeason = this.mapSeason.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getSeason(this.props.match.params.id));
    if (!this.props.players.length > 0) {
      this.props.dispatch(getAllPlayers());
    }
  }

  componentWillReceiveProps(props) {
    if (props.season && !props.season.results) {
      this.props.dispatch(getSeasonResults(props.season.leagues));
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
      results.forEach((league) => {
        leagueKeys.push(league.id);
        league.results.forEach((result) => {
          if (players[result.player_id]) {
            players[result.player_id][league.id] = { points: result.points, bonus: result.bonus };
          } else {
            const playerDetails = this.props.players.find(p => p.id === result.player_id);
            players[result.player_id] = { details: playerDetails };
            players[result.player_id][league.id] = { points: result.points, bonus: result.points };
          }
        });
      });
      const playersKeys = Object.keys(players);
      const playersArr = [];
      playersKeys.forEach((key) => {
        let sum = 0;
        let bonus = 0;
        leagueKeys.forEach((leagueKey) => {
          if (players[key][leagueKey]) {
            const { points } = players[key][leagueKey];
            sum += Number(points);
            if (players[key][leagueKey].bonus === '1') {
              bonus += 4;
              sum += 4;
            }
          }
        });
        players[key].sum = sum;
        players[key].bonus = bonus;
        playersArr.push(players[key]);
      });
      playersArr.sort((a, b) => b.sum - a.sum);
      // Table header
      const tableHeader = [];
      const headerRow = [];
      headerRow.push(<th key="corner" />);
      this.props.season.leagues.forEach((league) => {
        headerRow.push(<th className="center-text" key={league.id}>{league.name}</th>);
      });
      headerRow.push(<th className="center-text" key="bns">{phrases.season.bonus}</th>);
      headerRow.push(<th className="center-text" key="sum">{phrases.season.sum}</th>);
      tableHeader.push(<tr key="header">{headerRow}</tr>);
      // Table body
      const tableBody = [];
      playersArr.forEach((player, idx) => {
        const tableRow = [];
        tableRow.push(<td className="name-cell" key={player.details.id}>{`${idx + 1}.  ${player.details.firstName} ${player.details.lastName}` }</td>);
        leagueKeys.forEach((leagueKey) => {
          let pts = '-';
          if (player[leagueKey]) {
            pts = player[leagueKey].points;
          }
          tableRow.push(<td key={leagueKey + player.details.id} className="center-text">{pts}</td>);
        });
        tableRow.push(<td className="center-text sum-cell" key="bns">{player.bonus}</td>);
        tableRow.push(<td className="center-text sum-cell" key="sum">{player.sum}</td>);
        tableBody.push(<tr key={player.details.id}>{tableRow}</tr>);
        table.header = tableHeader;
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
              {table.header && table.body ?
                <table className="table table-hover">
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
  season: store.season.selectedSeason,
  players: store.player.playerList,
  loading: store.season.loading,
}))(SeasonDetails);
