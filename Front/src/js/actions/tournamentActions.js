import axios from 'axios';

import serverDetails from '../apiDetails';
import phrases from '../../Phrases';

// GET

export function getAllTournaments(user) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_ALL_TOURNAMENTS',
      payload: '',
    });
    axios.get(
      `${serverDetails.baseUrl}tournaments`,
      { auth: { username: user.id, password: user.token } },
    ).then((response) => {
      const tournaments = [];
      response.data.forEach((tournament) => {
        tournaments.push(tournament);
      });
      dispatch({
        type: 'FETCH_ALL_TOURNAMENTS_FULFILLED',
        payload: tournaments,
      });
    })
      .catch((err) => {
        dispatch({
          type: 'FETCH_ALL_TOURNAMENTS_REJECTED',
          payload: err,
        });
      });
  };
}

export function getTournament(tournamentId, user) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_TOURNAMENT',
      payload: '',
    });
    axios.get(
      `${serverDetails.baseUrl}tournaments/${tournamentId}`,
      { auth: { username: user.id, password: user.token } },
    ).then((response) => {
      dispatch({
        type: 'FETCH_TOURNAMENT_FULFILLED',
        payload: response.data[0],
      });
    })
      .catch((error) => {
        dispatch({
          type: 'FETCH_TOURNAMENT_REJECTED',
          payload: error,
        });
      });
  };
}


export function getTournamentResults(tournamentId, user) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_TOURNAMENT_RESULTS',
      payload: '',
    });
    axios.get(
      `${serverDetails.baseUrl}tournaments/${tournamentId}/results`,
      { auth: { username: user.id, password: user.token } },
    ).then((response) => {
      dispatch({
        type: 'FETCH_TOURNAMENT_RESULTS_FULFILLED',
        payload: response.data,
      });
    })
      .catch((error) => {
        dispatch({
          type: 'FETCH_TOURNAMENT_RESULTS_REJECTED',
          payload: error,
        });
      });
  };
}

// POST

export function createTournament(tournament, user) {
  return (dispatch) => {
    dispatch({
      type: 'CREATE_TOURNAMENT',
      payload: '',
    });
    axios({
      method: 'POST',
      url: `${serverDetails.baseUrl}tournaments`,
      data: { tournament },
      auth: { username: user.id, password: user.token },
    }).then(() => {
      dispatch({
        type: 'CREATE_TOURNAMENT_FULFILLED',
        payload: phrases.messages.createdTournament,
      });
    })
      .catch((error) => {
        dispatch({
          type: 'CREATE_TOURNAMENT_REJECTED',
          payload: { error, message: phrases.errorMessages.tournamentCreation },
        });
      });
  };
}

export function createTournamentResults(tournamentId, results, user) {
  return (dispatch) => {
    dispatch({
      type: 'CREATE_TOURNAMENT_RESULTS',
      payload: '',
    });
    axios.post(
      `${serverDetails.baseUrl}tournaments/${tournamentId}/results`, { results },
      { auth: { username: user.id, password: user.token } },
    ).then(() => {
      dispatch({
        type: 'CREATE_TOURNAMENT_RESULTS_FULFILLED',
        payload: phrases.messages.createdTournamentResults,
      });
    })
      .catch((error) => {
        dispatch({
          type: 'CREATE_TOURNAMENT_RESULTS_REJECTED',
          payload: { error, message: phrases.errorMessages.tournamentResultsCreation },
        });
      });
  };
}
