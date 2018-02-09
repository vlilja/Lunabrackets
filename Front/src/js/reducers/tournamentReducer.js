export default function reducer(state = {
  tournaments: null,
  selectedTournament: null,
  message: '',
  loading: false,
  error: null,
}, action) {
  switch (action.type) {
    case 'CREATE_TOURNAMENT': {
      return { ...state, loading: true, error: null };
    }
    case 'CREATE_TOURNAMENT_FULFILLED': {
      return {
        ...state, loading: false, message: action.payload, error: null,
      };
    }
    case 'CREATE_TOURNAMENT_REJECTED': {
      return {
        ...state, loading: false, message: action.payload.message, error: action.payload.error,
      };
    }
    case 'CREATE_TOURNAMENT_RESULTS': {
      return { ...state, loading: true, error: null };
    }
    case 'CREATE_TOURNAMENT_RESULTS_FULFILLED': {
      return {
        ...state, loading: false, message: action.payload, error: null,
      };
    }
    case 'CREATE_TOURNAMENT_RESULTS_REJECTED': {
      return {
        ...state, loading: false, message: action.payload.message, error: action.payload.error,
      };
    }
    case 'FETCH_TOURNAMENT': {
      return {
        ...state, loading: true, selectedTournament: null,
      };
    }
    case 'FETCH_TOURNAMENT_FULFILLED': {
      return {
        ...state, loading: false, selectedTournament: action.payload,
      };
    }
    case 'FETCH_TOURNAMENT_REJECTED': {
      return {
        ...state, loading: true, error: action.payload.error, message: action.payload.message,
      };
    }
    case 'FETCH_TOURNAMENT_RESULTS': {
      return {
        ...state, loading: true,
      };
    }
    case 'FETCH_TOURNAMENT_RESULTS_FULFILLED': {
      return {
        ...state, loading: false, selectedTournament: { ...state.selectedTournament, results: action.payload },
      };
    }
    case 'FETCH_TOURNAMENT_RESULTS_REJECTED': {
      return {
        ...state, loading: true, error: action.payload.error, message: action.payload.message,
      };
    }
    case 'FETCH_ALL_TOURNAMENTS': {
      return {
        ...state, loading: true,
      };
    }
    case 'FETCH_ALL_TOURNAMENTS_FULFILLED': {
      return {
        ...state, loading: false, tournaments: action.payload,
      };
    }
    case 'FETCH_ALL_TOURNAMENTS_REJECTED': {
      return {
        ...state, loading: true, error: action.payload.error, message: action.payload.message,
      };
    }
    default: {
      return { ...state };
    }
  }
}
