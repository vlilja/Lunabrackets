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

export function getGroupResults(leagueId, groupId) {
  return function(dispatch) {
    dispatch({
      type: 'FETCH_LEAGUE_GROUP_RESULTS',
      payload: ''
    })
    axios.get(serverDetails.baseUrl + 'leagues/' + leagueId + '/groups/' + groupId + '/results').then((response) => {
        dispatch({
          type: 'FETCH_LEAGUE_GROUP_RESULTS_FULFILLED',
          payload: response.data
        })
      })
      .catch((err) => {
        dispatch({
          type: 'FETCH_LEAGUE_GROUP_RESULTS_REJECTED',
          payload: err
        })
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
          type: 'FETCH_ALL_LEAGUE_GROUP_MATCHES_FULFILLED',
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

export function getUndetermined(leagueId) {
  return function(dispatch) {
    dispatch({
      type: 'FETCH_UNDETERMINED',
      payload: ''
    })
    axios.get(serverDetails.baseUrl + 'leagues/' + leagueId + '/groups/undetermined').then((response) => {
        dispatch({
          type: 'FETCH_UNDETERMINED_FULFILLED',
          payload: response.data
        })
      })
      .catch((err) => {
        dispatch({
          type: 'FETCH_UNDETERMINED_REJECTED',
          payload: err
        })
      })
  }
}

export function updateUndetermined(leagueId, group) {
  return function(dispatch) {
    dispatch({
      type: 'UPDATE_UNDETERMINED',
      payload: ''
    })
    axios.post(serverDetails.baseUrl + 'leagues/' + leagueId + '/groups/undetermined', {group:group}).then((response) => {
        dispatch({
          type: 'UPDATE_UNDETERMINED_FULFILLED',
          payload: response.data
        })
        dispatch(getUndetermined(leagueId));
      })
      .catch((err) => {
        dispatch({
          type: 'UPDATE_UNDETERMINED_REJECTED',
          payload: err
        })
      })
  }
}


export function getQualifierMatches(leagueId) {
  return function(dispatch) {
    dispatch({
      type: 'FETCH_QUALIFIER_MATCHES',
      payload: ''
    })
    axios.get(serverDetails.baseUrl + 'leagues/' + leagueId + '/qualifiers/matches').then((response) => {
        dispatch({
          type: 'FETCH_QUALIFIER_MATCHES_FULFILLED',
          payload: response.data
        })
      })
      .catch((err) => {
        dispatch({
          type: 'FETCH_QUALIFIER_MATCHES_REJECTED',
          payload: err
        })
      })
  }
}

export function getEliminationMatches(leagueId) {
  return function(dispatch) {
    dispatch({
      type:'FETCH_ELIMINATION_MATCHES',
      payload:''
    })
    axios.get(serverDetails.baseUrl + 'leagues/' + leagueId + '/elimination/matches').then((response) => {
      dispatch({
        type:'FETCH_ELIMINATION_MATCHES_FULFILLED',
        payload:response.data
      })
    })
    .catch((error) => {
      dispatch({
        type:'FETCH_ELIMINATION_MATCHES_REJECTED',
        payload:response.data
      })
    })
  }
}

export function getFinalsMatches(leagueId) {
  return function(dispatch) {
    dispatch({
      type:'FETCH_FINALS_MATCHES',
      payload:''
    })
    axios.get(serverDetails.baseUrl + 'leagues/' + leagueId + '/finals/matches').then((response) => {
      dispatch({
        type:'FETCH_FINALS_MATCHES_FULFILLED',
        payload:response.data
      })
    })
    .catch((error) => {
      dispatch({
        type:'FETCH_FINALS_MATCHES_REJECTED',
        payload: response.data
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

export function updateEliminationMatch(leagueId, match) {
  return function(dispatch){
    dispatch({
      type: 'UPDATE_ELIMINATION_MATCH',
      payload: ''
    })
    axios.post(serverDetails.baseUrl + 'leagues/'+leagueId+ '/elimination/matches/'+match.match_key, {
      match:match
    })
    .then((response) => {
      dispatch({
        type:'UPDATE_ELIMINATION_MATCH_FULFILLED',
        payload: response.data
      })
      dispatch(getEliminationMatches(leagueId));
    })
    .catch((error) => {
      dispatch({
        type:'UPDATE_ELIMINATION_MATCH_REJECTED',
        payload:error
      })
    })
  }
}

function flashMessage(dispatch, time) {
  dispatch({
    type: 'SHOW_MESSAGE',
    payload: ''
  })
  setTimeout(() => {
    dispatch({
      type: 'HIDE_MESSAGE',
      payload: ''
    })
  }, time);
}
