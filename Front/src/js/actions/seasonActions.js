import axios from 'axios';
import { Season } from 'lunabrackets-datamodel';

import serverDetails from '../apiDetails';

export function getSeasons() {
  return (dispatch) => {
    dispatch({
      type: 'GET_SEASONS',
      payload: '',
    });
    axios.get(`${serverDetails.baseUrl}seasons`).then((response) => {
      const seasons = [];
      response.data.forEach((season) => {
        seasons.push((Object.assign(new Season(), season)));
      });
      dispatch({
        type: 'GET_SEASONS_FULFILLED',
        payload: seasons,
      });
    })
      .catch(() => {
        dispatch({
          type: 'GET_SEASONS_REJECTED',
          payload: 'Error fetching seasons',
        });
      });
  };
}

export function getSeason(seasonId) {
  return (dispatch) => {
    dispatch({
      type: 'GET_SEASON',
      payload: '',
    });
    axios.get(`${serverDetails.baseUrl}seasons/${seasonId}`).then((response) => {
      const seasons = [];
      response.data.forEach((season) => {
        seasons.push((Object.assign(new Season(), season)));
      });
      dispatch({
        type: 'GET_SEASON_FULFILLED',
        payload: seasons[0],
      });
    })
      .catch(() => {
        dispatch({
          type: 'GET_SEASON_REJECTED',
          payload: 'Error fetching season',
        });
      });
  };
}

export function getSeasonResults(leagues, tournaments) {
  return (dispatch) => {
    dispatch({
      type: 'GET_SEASON_RESULTS',
      payload: '',
    });
    const requests = [];
    leagues.forEach((league) => {
      requests.push(axios.get(`${serverDetails.baseUrl}leagues/${league.id}/results`));
    });
    tournaments.forEach((tournament) => {
      requests.push(axios.get(`${serverDetails.baseUrl}tournaments/${tournament.id}/results`));
    });
    axios.all(requests).then((response) => {
      const leagueResults = [];
      const tournamentResults = [];
      response.forEach((res, idx) => {
        if (idx < 4) {
          leagueResults.push({ id: res.data.id, results: res.data.results });
        } else {
          tournamentResults.push({ id: res.data.id, results: res.data.results });
        }
      });
      dispatch({
        type: 'GET_SEASON_RESULTS_FULFILLED',
        payload: { leagues: leagueResults, tournaments: tournamentResults },
      });
    })
      .catch(() => {
        dispatch({
          type: 'GET_SEASON_RESULTS_REJECTED',
          payload: 'Error fetching season results',
        });
      });
  };
}

export function createSeason(season) {
  return (dispatch) => {
    dispatch({
      type: 'CREATE_SEASON',
      payload: '',
    });
    axios.post(`${serverDetails.baseUrl}seasons/`, {
      season,
    })
      .then(() => {
        dispatch({
          type: 'CREATE_SEASON_FULFILLED',
          payload: 'Season created successfully',
        });
      })
      .catch((error) => {
        dispatch({
          type: 'CREATE_SEASON_REJECTED',
          payload: error,
        });
      });
  };
}
