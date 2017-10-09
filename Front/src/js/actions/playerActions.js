import axios from "axios";
import serverDetails from "../apiDetails";


export function searchPlayers(queryParam) {
  return function(dispatch) {
    dispatch({
      type: 'FETCH_PLAYERS',
      payload: ''
    });
    axios.get(serverDetails.baseUrl + 'players', {
        params: {
          playerName: queryParam
        }
      }).then((response) => {
        console.log(response);
        dispatch({
          type: 'FETCH_PLAYERS_FULFILLED',
          payload: response.data
        })
      })
      .catch((err) => {
        dispatch({
          type: "FETCH_PLAYERS_REJECTED",
          payload: err
        })
      })
  }
}

export function getAllPlayers(queryParam) {
  return function(dispatch) {
    dispatch({
      type: 'FETCH_ALL_PLAYERS',
      payload: ''
    });
    axios.get(serverDetails.baseUrl + 'players').then((response) => {
        dispatch({
          type: 'FETCH_ALL_PLAYERS_FULFILLED',
          payload: response.data
        })
      })
      .catch((err) => {
        dispatch({
          type: "FETCH_ALL_PLAYERS_REJECTED",
          payload: err
        })
      })
  }
}

export function getPlayerById(playerId) {
  return function(dispatch) {
    dispatch({
      type: 'FETCH_PLAYER',
      payload: ''
    });
    axios.get(serverDetails.baseUrl + 'players/' + playerId).then((response) => {
        console.log(response);
        dispatch({
          type: 'FETCH_PLAYER_FULFILLED',
          payload: response.data
        })
      })
      .catch((err) => {
        dispatch({
          type: "FETCH_PLAYER_REJECTED",
          payload: err
        })
      })
  }
}
