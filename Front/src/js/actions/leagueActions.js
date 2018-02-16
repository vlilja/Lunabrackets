import axios from 'axios';
import {
  League,
  Group,
  Match,
} from 'lunabrackets-datamodel';
import phrases from '../../Phrases';

import serverDetails from '../apiDetails';

function flashMessage(dispatch, time, reload = 0) {
  dispatch({
    type: 'SHOW_MESSAGE',
    payload: '',
  });
  setTimeout(() => {
    dispatch({
      type: 'HIDE_MESSAGE',
      payload: '',
    });
    if (reload) {
      window.location.reload();
    }
  }, time);
}

export function createLeague(league, user) {
  return (dispatch) => {
    dispatch({
      type: 'CREATE_LEAGUE',
      payload: '',
    });
    axios.post(`${serverDetails.baseUrl}leagues`, league, { auth: { username: user.id, password: user.fbId } }).then((response) => {
      dispatch({
        type: 'CREATE_LEAGUE_FULFILLED',
        payload: response.data,
      });
    })
      .catch((err) => {
        dispatch({
          type: 'CREATE_LEAGUE_REJECTED',
          payload: { error: err, message: 'Error creating league' },
        });
      });
  };
}

export function getAllLeagues() {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_ALL_LEAGUES',
      payload: '',
    });
    axios.get(`${serverDetails.baseUrl}leagues`).then((response) => {
      const leagues = [];
      response.data.forEach((league) => {
        leagues.push(Object.assign(new League(), league));
      });
      dispatch({
        type: 'FETCH_ALL_LEAGUES_FULFILLED',
        payload: leagues,
      });
    })
      .catch((err) => {
        dispatch({
          type: 'FETCH_ALL_LEAGUES_REJECTED',
          payload: err,
        });
      });
  };
}

export function getLeague(leagueId) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_LEAGUE',
      payload: '',
    });
    axios.get(`${serverDetails.baseUrl}leagues/${leagueId}`).then((response) => {
      const league = Object.assign(new League(), response.data);
      dispatch({
        type: 'FETCH_LEAGUE_FULFILLED',
        payload: league,
      });
    })
      .catch((err) => {
        dispatch({
          type: 'FETCH_LEAGUE_REJECTED',
          payload: err,
        });
      });
  };
}

export function getLeagueResults(leagueId) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_LEAGUE_RESULTS',
      payload: '',
    });
    axios.get(`${serverDetails.baseUrl}leagues/${leagueId}/results`).then((response) => {
      dispatch({
        type: 'FETCH_LEAGUE_RESULTS_FULFILLED',
        payload: response.data,
      });
    })
      .catch((error) => {
        dispatch({
          type: 'FETCH_LEAGUE_RESULTS_REJECTED',
          payload: error,
        });
      });
  };
}

export function getLeagueGroups(leagueId) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_ALL_LEAGUE_GROUPS',
      payload: '',
    });
    const groups = {};
    axios.get(`${serverDetails.baseUrl}leagues/${leagueId}/groups`).then((response) => {
      response.data.forEach((group) => {
        groups[group.key] = Object.assign(new Group(), group);
      });
      const promises = [];
      const groupsKeys = Object.keys(groups);
      groupsKeys.forEach((key) => {
        promises.push(axios.get(`${serverDetails.baseUrl}leagues/${leagueId}/groups/${groups[key].id}/matches`));
      });
      return Promise.all(promises);
    })
      .then((response) => {
        const keys = Object.keys(groups);
        keys.forEach((key, idx) => {
          response[idx].data.forEach((match) => {
            groups[key].matches.push(Object.assign(new Match(), match));
          });
        });
        dispatch({
          type: 'FETCH_ALL_LEAGUE_GROUPS_FULFILLED',
          payload: groups,
        });
      })
      .catch((err) => {
        dispatch({
          type: 'FETCH_ALL_LEAGUE_GROUPS_REJECTED',
          payload: err,
        });
      });
  };
}

export function getGroupResults(leagueId, groupId) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_LEAGUE_GROUP_RESULTS',
      payload: '',
    });
    axios.get(`${serverDetails.baseUrl}leagues/${leagueId}/groups/${groupId}/results`).then((response) => {
      dispatch({
        type: 'FETCH_LEAGUE_GROUP_RESULTS_FULFILLED',
        payload: response.data,
      });
    })
      .catch((err) => {
        dispatch({
          type: 'FETCH_LEAGUE_GROUP_RESULTS_REJECTED',
          payload: err,
        });
      });
  };
}

export function getLeagueGroupMatches(leagueId, groupId) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_ALL_LEAGUE_GROUP_MATCHES',
      payload: '',
    });
    axios.get(`${serverDetails.baseUrl}leagues/${leagueId}/groups/${groupId}/matches`).then((response) => {
      dispatch({
        type: 'FETCH_ALL_LEAGUE_GROUP_MATCHES_FULFILLED',
        payload: response.data,
      });
    })
      .catch((err) => {
        dispatch({
          type: 'FETCH_ALL_LEAGUE_GROUP_MATCHES_REJECTED',
          payload: err,
        });
      });
  };
}

export function getUndetermined(leagueId) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_UNDETERMINED',
      payload: '',
    });
    axios.get(`${serverDetails.baseUrl}leagues/${leagueId}/groups/undetermined`).then((response) => {
      dispatch({
        type: 'FETCH_UNDETERMINED_FULFILLED',
        payload: response.data,
      });
    })
      .catch((err) => {
        dispatch({
          type: 'FETCH_UNDETERMINED_REJECTED',
          payload: err,
        });
      });
  };
}

export function updateUndetermined(leagueId, group, user) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_UNDETERMINED',
      payload: '',
    });
    axios.post(
      `${serverDetails.baseUrl}leagues/${leagueId}/groups/undetermined`, {
        group,
      },
      { auth: { username: user.id, password: user.fbId } },
    ).then((response) => {
      dispatch({
        type: 'UPDATE_UNDETERMINED_FULFILLED',
        payload: response.data,
      });
      flashMessage(dispatch, 2000);
      dispatch(getUndetermined(leagueId));
    })
      .catch((err) => {
        dispatch({
          type: 'UPDATE_UNDETERMINED_REJECTED',
          payload: err,
        });
        flashMessage(dispatch, 2000);
        dispatch(getUndetermined(leagueId));
      });
  };
}


export function getQualifierMatches(leagueId) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_QUALIFIER_MATCHES',
      payload: '',
    });
    axios.get(`${serverDetails.baseUrl}leagues/${leagueId}/qualifiers/matches`).then((response) => {
      const matches = [];
      response.data.forEach((match) => {
        matches.push(Object.assign(new Match(), match));
      });
      dispatch({
        type: 'FETCH_QUALIFIER_MATCHES_FULFILLED',
        payload: matches,
      });
    })
      .catch((err) => {
        dispatch({
          type: 'FETCH_QUALIFIER_MATCHES_REJECTED',
          payload: err,
        });
      });
  };
}

export function getEliminationMatches(leagueId) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_ELIMINATION_MATCHES',
      payload: '',
    });
    axios.get(`${serverDetails.baseUrl}leagues/${leagueId}/elimination/matches`).then((response) => {
      const matches = [];
      response.data.forEach((match) => {
        matches.push(Object.assign(new Match(), match));
      });
      dispatch({
        type: 'FETCH_ELIMINATION_MATCHES_FULFILLED',
        payload: matches,
      });
    })
      .catch((error) => {
        dispatch({
          type: 'FETCH_ELIMINATION_MATCHES_REJECTED',
          payload: error,
        });
      });
  };
}

export function getFinalsMatches(leagueId) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_FINALS_MATCHES',
      payload: '',
    });
    axios.get(`${serverDetails.baseUrl}leagues/${leagueId}/finals/matches`).then((response) => {
      const matches = [];
      response.data.forEach((match) => {
        matches.push(Object.assign(new Match(), match));
      });
      dispatch({
        type: 'FETCH_FINALS_MATCHES_FULFILLED',
        payload: matches,
      });
    })
      .catch((error) => {
        dispatch({
          type: 'FETCH_FINALS_MATCHES_REJECTED',
          payload: error,
        });
      });
  };
}

export function startLeague(leagueId, players, groupNames, raceTo, user) {
  return (dispatch) => {
    dispatch({
      type: 'START_LEAGUE',
      payload: '',
    });
    axios.post(
      `${serverDetails.baseUrl}leagues/${leagueId}/start?id=${user.id}`, {
        players,
        groupNames,
        raceTo,
      },
      { auth: { username: user.id, password: user.fbId } },
    )
      .then(() => {
        dispatch({
          type: 'START_LEAGUE_FULFILLED',
          payload: phrases.messages.leagueStart,
        });
        flashMessage(dispatch, 2000, true);
      })
      .catch((error) => {
        dispatch({
          type: 'START_LEAGUE_REJECTED',
          payload: { error, message: phrases.errorMessages.leagueStart },
        });
        flashMessage(dispatch, 2000);
      });
  };
}

export function startQualifiers(leagueId, user) {
  return (dispatch) => {
    dispatch({
      type: 'START_QUALIFIERS',
      payload: '',
    });
    axios.get(
      `${serverDetails.baseUrl}leagues/${leagueId}/start/qualifiers?id=${user.id}`,
      { auth: { username: user.id, password: user.fbId } },
    )
      .then((response) => {
        dispatch({
          type: 'START_QUALIFIERS_FULFILLED',
          payload: response.data,
        });
        flashMessage(dispatch, 2000, true);
      })
      .catch((error) => {
        dispatch({
          type: 'START_QUALIFIERS_REJECTED',
          payload: error,
        });
        flashMessage(dispatch, 2000);
      });
  };
}

export function startFinals(leagueId, players, user) {
  return (dispatch) => {
    dispatch({
      type: 'START_FINALS',
      payload: '',
    });
    axios.post(
      `${serverDetails.baseUrl}leagues/${leagueId}/start/finals`, { players },
      { auth: { username: user.id, password: user.fbId } },
    )
      .then(() => {
        dispatch({
          type: 'START_FINALS_FULFILLED',
          payload: phrases.messages.finalsStarted,
        });
        flashMessage(dispatch, 2000, true);
      })
      .catch((error) => {
        dispatch({
          type: 'START_FINALS_REJECTED',
          payload: { error, message: phrases.errorMessages.finals },
        });
        flashMessage(dispatch, 2000);
      });
  };
}

export function finishLeague(leagueId, user) {
  return (dispatch) => {
    dispatch({
      type: 'FINISH_LEAGUE',
      payload: '',
    });
    axios.get(
      `${serverDetails.baseUrl}leagues/${leagueId}/finish?id=${user.id}`,
      { auth: { username: user.id, password: user.fbId } },
    )
      .then(() => {
        dispatch({
          type: 'FINISH_LEAGUE_FULFILLED',
          payload: phrases.messages.leagueFinished,
        });
        flashMessage(dispatch, 2000, true);
      })
      .catch((error) => {
        dispatch({
          type: 'FINISH_LEAGUE_REJECTED',
          payload: { error, message: phrases.errorMessages.finish },
        });
        flashMessage(dispatch, 2000);
      });
  };
}

export function updateGroupStageMatch(leagueId, groupId, match, user) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_MATCH',
      payload: '',
    });
    axios.post(
      `${serverDetails.baseUrl}leagues/${leagueId}/groups/${groupId}/matches/${match.id}`, { match },
      { auth: { username: user.id, password: user.fbId } },
    ).then(() => {
      dispatch({
        type: 'UPDATE_MATCH_FULFILLED',
        payload: phrases.messages.matchUpdate,
      });
      flashMessage(dispatch, 2000);
      dispatch(getLeagueGroups(leagueId));
    })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_MATCH_REJECTED',
          payload: { error, message: phrases.errorMessages.matchUpdate },
        });
        flashMessage(dispatch, 2000);
        dispatch(getLeagueGroups(leagueId));
      });
  };
}

export function updateEliminationMatch(leagueId, match, user) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_ELIMINATION_MATCH',
      payload: '',
    });
    axios.post(`${serverDetails.baseUrl}leagues/${leagueId}/elimination/matches/${match.id}`, {
      match,
    }, { auth: { username: user.id, password: user.fbId } })
      .then(() => {
        dispatch({
          type: 'UPDATE_ELIMINATION_MATCH_FULFILLED',
          payload: phrases.messages.matchUpdate,
        });
        dispatch(getEliminationMatches(leagueId));
        flashMessage(dispatch, 2000);
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_ELIMINATION_MATCH_REJECTED',
          payload: error,
        });
        flashMessage(dispatch, 2000);
        dispatch(getEliminationMatches(leagueId));
      });
  };
}

export function updateQualifierMatch(leagueId, match, user) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_QUALIFIER_MATCH',
      payload: '',
    });
    axios.post(
      `${serverDetails.baseUrl}leagues/${leagueId}/qualifiers/matches/${match.id}`, {
        match,
      },
      { auth: { username: user.id, password: user.fbId } },
    )
      .then(() => {
        dispatch({
          type: 'UPDATE_QUALIFIER_MATCH_FULFILLED',
          payload: phrases.messages.matchUpdate,
        });
        dispatch(getQualifierMatches(leagueId));
        flashMessage(dispatch, 2000);
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_QUALIFIER_MATCH_REJECTED',
          payload: error,
        });
        flashMessage(dispatch, 2000);
        dispatch(getQualifierMatches(leagueId));
      });
  };
}

export function updateFinalsMatch(leagueId, match, user) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_FINALS_MATCH',
      payload: '',
    });
    axios.post(
      `${serverDetails.baseUrl}leagues/${leagueId}/finals/matches/${match.id}`, {
        match,
      },
      { auth: { username: user.id, password: user.fbId } },
    )
      .then(() => {
        dispatch({
          type: 'UPDATE_FINALS_MATCH_FULFILLED',
          payload: phrases.messages.matchUpdate,
        });
        dispatch(getFinalsMatches(leagueId));
        flashMessage(dispatch, 2000);
      })
      .catch((error) => {
        dispatch({
          type: 'UPDATE_FINALS_MATCH_REJECTED',
          payload: { error, message: phrases.errorMessages.matchUpdate },
        });
        dispatch(getFinalsMatches(leagueId));
        flashMessage(dispatch, 2000);
      });
  };
}
