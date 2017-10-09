import axios from "axios";
import serverDetails from "../apiDetails";


export function createLeague(league) {
  return function(dispatch) {
    dispatch({
      type: 'CREATE_LEAGUE',
      payload: ''
    });
    axios.post(serverDetails.baseUrl + 'leagues', league).then((response) => {
        dispatch({
          type: 'CREATE_LEAGUE_FULFILLED',
          payload: response.data
        })
      })
      .catch((err) => {
        dispatch({
          type: "CREATE_LEAGUE_REJECTED",
          payload: err
        })
      })
  }
}

export function getAllLeagues() {
  return function(dispatch) {
    dispatch({
      type: 'FETCH_ALL_LEAGUES',
      payload: ''
    });
    axios.get(serverDetails.baseUrl + 'leagues').then((response) => {
        dispatch({
          type: 'FETCH_ALL_LEAGUES_FULFILLED',
          payload: response.data
        })
      })
      .catch((err) => {
        dispatch({
          type: "FETCH_ALL_LEAGUES_REJECTED",
          payload: err
        })
      })
  }
}

export function getLeague(leagueId) {
  return function(dispatch) {
    dispatch({
      type: 'FETCH_LEAGUE',
      payload: ''
    });
    axios.get(serverDetails.baseUrl + 'leagues/' + leagueId).then((response) => {
        dispatch({
          type: 'FETCH_LEAGUE_FULFILLED',
          payload: response.data
        })
      })
      .catch((err) => {
        dispatch({
          type: "FETCH_LEAGUE_REJECTED",
          payload: err
        })
      })
  }
}

export function getLeagueGroups(leagueId) {
  return function(dispatch) {
    dispatch({
      type: 'FETCH_ALL_LEAGUE_GROUPS',
      payload: ''
    });
    axios.get(serverDetails.baseUrl + 'leagues/' + leagueId + '/groups').then((response) => {
        dispatch({
          type: 'FETCH_ALL_LEAGUE_GROUPS_FULFILLED',
          payload: response.data
        })
      })
      .catch((err) => {
        dispatch({
          type: "FETCH_ALL_LEAGUE_GROUPS_REJECTED",
          payload: err
        })
      })
  }
}

export function startLeague(leagueId, participants, groups) {
  return function(dispatch) {
    console.log(dispatch);
    dispatch({
      type: 'START_LEAGUE',
      payload: ''
    });
    axios.post(serverDetails.baseUrl + 'leagues/' + leagueId + '/start', {participants:participants, groups:groups})
      .then((response) => {
        dispatch({
          type: 'START_LEAGUE_FULFILLED',
          payload: response.data
        })
      })
      .catch((err) => {
        dispatch({
          type: "START_LEAGUE_REJECTED",
          payload: err
        })
      })
  }
}
