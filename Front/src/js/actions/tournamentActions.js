import axios from "axios";
import serverDetails from "../apiDetails";
import helper from "./tournamentActionsHelper";
import Player from "../classes/player";
import Match from "../classes/match";
import view from "./viewActions";

export function fetchTournaments() {
    return function(dispatch) {
        axios.get(serverDetails.baseUrl + '/tournaments')
            .then((response) => {
                dispatch({
                    type: 'FETCH_TOURNAMENTS_FULFILLED',
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: "FETCH_TOURNAMENTS_REJECTED",
                    payload: err
                })
            })
    }
}

export function fetchParticipants(id) {
    return function(dispatch) {
        axios.get(serverDetails.baseUrl + '/tournaments/' + id + '/participants')
            .then((response) => {
                console.log(response.data);
                dispatch({
                    type: 'FETCH_PARTICIPANTS_FULFILLED',
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: "FETCH_PARTICIPANTS_REJECTED",
                    payload: err
                })
            })
    }
}

export function addParticipant(tournamentId, participantId) {
    return function(dispatch) {
        axios.post(serverDetails.baseUrl + '/tournaments/' + tournamentId + '/participants/' + participantId)
            .then((response) => {
                dispatch({
                    type: "ADD_PARTICIPANT_FULFILLED",
                    payload: response.data
                })
                dispatch(fetchParticipants(tournamentId));
            })
            .catch((err) => {
                dispatch({
                    type: "ADD_PARTICIPANT_REJECTED",
                    payload: err
                })
            })
    }
}

export function createTournament(tournament) {
    return function(dispatch) {
        axios.post(serverDetails.baseUrl + '/tournaments/', tournament)
            .then((response) => {
                dispatch({
                    type: 'CREATE_TOURNAMENT_FULFILLED',
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: "CREATE_TOURNAMENT_REJECTED",
                    payload: err
                })
            })
    }
}

export function selectTournament(tournament) {
    return function(dispatch) {
        dispatch({
          type: 'CLEAR_SELECTED_TOURNAMENT_INFO',
          payload: {}
        })
        axios.get(serverDetails.baseUrl + '/tournaments/' + tournament.id + '/raceto/')
            .then((response) => {
                tournament.raceTo = response.data;
                dispatch({
                    type: 'SELECT_TOURNAMENT',
                    payload: tournament
                });
                dispatch({
                    type: 'SHOW_TOURNAMENT_VIEW',
                    payload: {}
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function getSingleEliminationMatches(tournamentId) {
  return function(dispatch){
      dispatch({type:'FETCH_SINGLE_ELIMINATION_MATCHES',
      payload:''
      });
      axios.get(serverDetails.baseUrl + '/tournaments/' + tournamentId + '/single-elimination/')
      .then((result) => {
        var matches = helper.convertJSONtoMatches(result);
        dispatch({
          type:'FETCH_SINGLE_ELIMINATION_MATCHES_FULLFILLED',
          payload:{winnerSide:matches,
          loserSide:''}
        })
      })
      .catch((error) => {
          dispatch({
            type:'FETCH_SINGLE_ELIMINATION_MATCHES_REJECTED',
            payload:error
          })
      })
  }
}

export function startSingleElimination(tournament, participants) {
    return function(dispatch) {
        console.log(participants);
        while (participants.length < tournament.size) {
            participants.push(new Player(99, 'Walk', 'Over'));
        }
        console.log(participants);
        shuffle(participants);
        var matches = [];
        for (var i = 0; i < tournament.size - 1; i++) {
            var playerOne = null;
            var playerTwo = null;
            if (participants.length > 0) {
                playerOne = participants.pop();
                playerTwo = participants.pop();
            }
            matches.push(new Match(null, i + 1, playerOne, playerTwo, 0, 0, 0));
        }
        helper.setMatchOrder(tournament.size, matches);
        axios.post(serverDetails.baseUrl + '/tournaments/' + tournament.id + '/single-elimination/', {
                matches: matches
            })
            .then((result) => {
                dispatch(view.showHomeScreen());
              })
            .catch((error) => {
                dispatch({
                    type: 'CREATE_SINGLE_ELIMINATION_MATCHES_FAILED',
                    payload: error
                })
            })

    }
}

export function updateMatch(match, matches){
  var winnerSide = matches.winnerSide;
  match.completeMatch();
  for(var i = 0; i < winnerSide.length; i++){
    if(match.number === winnerSide[i].number){
      winnerSide[i] = match;
    }
    if(match.nextMatch === winnerSide[i].number){
      if(match.number % 2 === 0){
        winnerSide[i].playerTwo = match.winner;
      }
      else {
        winnerSide[i].playerOne = match.winner;
      }
    }
  }
  return function(dispatch) {
    dispatch({
      type: 'UPDATE_MATCHES',
      payload: {...matches, winnerSide:winnerSide, loserSide:[]}
    })
  }
}

export function updateSingleEliminationMatch(tournamentId, match) {
    return function(dispatch) {

        axios.post(serverDetails.baseUrl + '/tournaments/' + tournamentId + '/single-elimination/matches/' + match.id, {
                match: match
            })
            .then((result) => {
                dispatch({
                    type: 'UPDATE_MATCH_SUCCESSFULLY',
                    payload: result.data
                })
            })
            .catch((error) => {
                dispatch({
                    type: 'UPDATE_MATCH_FAILED',
                    payload: result.data
                })
            })
    }
}


function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}
