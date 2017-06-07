export default function reducer(state = {
  tournaments: [],
  selectedTournament: '',
  selectedTournamentParticipants: [],
  selectedTournamentMatches: {},
  fetching: false,
  fetched: false,
  fetchingMatches: false,
  fetchedMatches: false,
  error: null,
  message: ''

}, action) {

  switch (action.type) {
    case "FETCH_TOURNAMENTS":
      {
        return { ...state,
          fetching: true,
          message: ''
        }
      }
    case "FETCH_TOURNAMENTS_REJECTED":
      {
        return { ...state,
          fetching: false,
          error: action.payload
        }
      }
    case "FETCH_TOURNAMENTS_FULFILLED":
      {
        return {
          ...state,
          fetching: false,
          fetched: true,
          tournaments: action.payload,
        }
      }
    case "FETCH_PARTICIPANTS_FULFILLED":
      {
        return {
          ...state,
          fetching: false,
          fetched: true,
          selectedTournamentParticipants: action.payload,
        }
      }
    case "FETCH_PARTICIPANTS_REJECTED":
      {
        return { ...state,
          fetching: false,
          error: action.payload
        }
      }
    case "FETCH_SINGLE_ELIMINATION_MATCHES":
      {
        {
          return { ...state,
            fetchingMatches: true,
            message: ''
          }
        }
      }
    case "FETCH_SINGLE_ELIMINATION_MATCHES_FULLFILLED":
      {
        return { ...state,
          fetchingMatches: false,
          fetchedMatches: true,
          selectedTournamentMatches: action.payload
        }
      }
    case "FETCH_SINGLE_ELIMINATION_MATCHES_REJECTED":
      {
        return { ...state,
          fetching: false,
          fetched: false,
          error: action.payload
        }
      }
    case "FETCH_DOUBLE_ELIMINATION_MATCHES":
      {
        {
          return { ...state,
            fetchingMatches: true,
            message: ''
          }
        }
      }
    case "FETCH_DOUBLE_ELIMINATION_MATCHES_FULLFILLED":
      {
        return { ...state,
          fetchingMatches: false,
          fetchedMatches: true,
          selectedTournamentMatches: action.payload
        }
      }
    case "FETCH_DOUBLE_ELIMINATION_MATCHES_REJECTED":
      {
        return { ...state,
          fetching: false,
          fetched: false,
          error: action.payload
        }
      }
    case "CREATE_TOURNAMENT_FULFILLED":
      {
        return { ...state,
          message: {
            type: 'success',
            text: 'Tournament created successfully'
          }
        }
      }
    case "CREATE_TOURNAMENT_REJECTED":
      {
        return { ...state,
          error: action.payload,
          message: {
            type: 'error',
            text: 'There was an error in tournament creation'
          }
        }
      }
    case "ADD_PARTICIPANT_FULFILLED":
      {
        return { ...state,
          message: {
            type: 'success',
            text: 'Signup succeeded'
          }
        }
      }
    case "ADD_PARTICIPANT_REJECTED":
      {
        return { ...state,
          error: action.payload,
          message: {
            type: 'error',
            text: 'Signup failed, please try again later'
          }
        }
      }
    case "SELECT_TOURNAMENT":
      {
        return { ...state,
          selectedTournament: action.payload
        }
      }
    case "UPDATE_MATCHES":
      {
        {
          return {
            ...state,
            selectedTournamentMatches: action.payload
          }

        }
      }
    case "CLEAR_SELECTED_TOURNAMENT_INFO":
      {
        return { ...state,
          selectedTournament: action.payload,
          selectedTournamentParticipants: [],
          selectedTournamentMatches: [],
          fetching: false,
          fetched: false,
          fetchingMatches: false,
          fetchedMatches: false
        }
      }

  }

  return state;

}
