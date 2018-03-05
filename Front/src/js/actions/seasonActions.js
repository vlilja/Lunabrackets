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
    let requests = [];
    const results = { leagues: [], tournaments: [] };
    leagues.forEach((league) => {
      requests.push(axios.get(`${serverDetails.baseUrl}leagues/${league.id}/results`));
    });
    axios.all(requests).then((response) => {
      response.forEach((res) => {
        results.leagues.push({ id: res.data.id, results: res.data.results });
      });
    })
      .then(() => {
        requests = [];
        tournaments.forEach((tournament) => {
          requests.push(axios.get(`${serverDetails.baseUrl}tournaments/${tournament.id}/results`));
        });
        return axios.all(requests);
      })
      .then((response) => {
        response.forEach((res) => {
          results.tournaments.push({ id: res.data.id, results: res.data.results });
        });
        dispatch({
          type: 'GET_SEASON_RESULTS_FULFILLED',
          payload: results,
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

export function createSeason(season, user) {
  return (dispatch) => {
    dispatch({
      type: 'CREATE_SEASON',
      payload: '',
    });
    axios.post(`${serverDetails.baseUrl}seasons/`, {
      season,
    }, {
      auth: { username: user.id, password: user.fbId },
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

export function changeSeasonStatus(seasonId, status, user) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_SEASON_STATUS',
      payload: '',
    });
    let url;
    if (status === 1) {
      url = `${serverDetails.baseUrl}seasons/${seasonId}/activate`;
    }
    if (status === 0) {
      url = `${serverDetails.baseUrl}seasons/${seasonId}/inactivate`;
    }
    axios.get(url, {
      auth: { username: user.id, password: user.fbId },
    })
      .then(() => {
        dispatch({
          type: 'UPDATE_SEASON_STATUS_FULFILLED',
          payload: 'Season status changed successfully',
        });
        dispatch(getSeasons());
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_SEASON_STATUS_REJECTED',
          payload: { error, message: 'Season status change failed' },
        });
        dispatch(getSeasons());
      });
  };
}
