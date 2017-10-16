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
    var groups = {}
    axios.get(serverDetails.baseUrl + 'leagues/' + leagueId + '/groups').then((response) => {
      for (var i = 0; i < response.data.length; i++) {
        groups[response.data[i].id] = response.data[i];
      }
      var promises = [];
      for (var key in groups) {
        promises.push(axios.get(serverDetails.baseUrl + 'leagues/' + leagueId + '/groups/' + key + '/matches'));
      }
      return Promise.all(promises);
    }).
    then((response) => {
        response.forEach((response) => {
          groups[response.data.id].matches = response.data.matches;
        })
        dispatch({
          type: 'FETCH_ALL_LEAGUE_GROUPS_FULFILLED',
          payload: groups
        });
      })

      .catch((err) => {
        dispatch({
          type: "FETCH_ALL_LEAGUE_GROUPS_REJECTED",
          payload: err
        });
      })
  }
}

export function getLeagueGroupMatches(leagueId, groupId) {
  return function(dispatch) {
    dispatch({
      type: 'FETCH_ALL_LEAGUE_GROUP_MATCHES',
      payload: ''
    });
    axios.get(serverDetails.baseUrl + 'leagues/' + leagueId + '/groups/' + groupId + '/matches').then((response) => {
        dispatch({
          type: 'FETCH_ALL_LEAGUE_GROUP_MATCHES_FULLFILLED',
          payload: response.data
        })
      })
      .catch((err) => {
        dispatch({
          type: "FETCH_ALL_LEAGUE_GROUP_MATCHES_REJECTED",
          payload: err
        })
      })
  }
}

export function startLeague(leagueId, participants, groups, raceTo) {
  return function(dispatch) {
    dispatch({
      type: 'START_LEAGUE',
      payload: ''
    });
    axios.post(serverDetails.baseUrl + 'leagues/' + leagueId + '/start', {
        participants: participants,
        groups: groups,
        raceTo: raceTo
      })
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

export function updateGroupStageMatch(leagueId, groupId, match) {
  return function(dispatch) {
    dispatch({
      type: 'UPDATE_LEAGUE_MATCH',
      payload: ''
    });
    axios.post(serverDetails.baseUrl + 'leagues/' + leagueId + '/groups/' + groupId + '/matches/' + match.match_id, {
        match: match
      }).then((response) => {
        dispatch({
          type: 'UPDATE_MATCH_FULFILLED',
          payload: response.data
        })
        flashMessage(dispatch, 2000);
      })
      .catch((err) => {
        dispatch({
          type: "UPDATE_MATCH_REJECTED",
          payload: err
        })
        flashMessage(dispatch, 2000);
      })
  }
}

function flashMessage(dispatch, time) {
  dispatch({
    type:'SHOW_MESSAGE',
    payload:''
  })
  setTimeout(() => {
    dispatch({
      type:'HIDE_MESSAGE',
      payload:''
    })
  }, time);
}
