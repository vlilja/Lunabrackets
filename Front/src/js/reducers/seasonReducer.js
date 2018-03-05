export default function reducer(state = {
  seasons: [],
  selectedSeason: null,
  message: '',
  loading: false,
  error: null,
}, action) {
  switch (action.type) {
    case 'GET_SEASONS':
    {
      return {
        ...state,
        loading: true,
      };
    }
    case 'GET_SEASONS_FULFILLED':
    {
      return {
        ...state,
        loading: false,
        seasons: action.payload,
      };
    }
    case 'GET_SEASONS_REJECTED':
    {
      return {
        ...state,
        loading: false,
        seasons: null,
        error: action.payload,
      };
    }
    case 'GET_SEASON':
    {
      return {
        ...state,
        selectedSeason: null,
        loading: true,
      };
    }
    case 'GET_SEASON_FULFILLED':
    {
      return {
        ...state,
        loading: false,
        selectedSeason: action.payload,
      };
    }
    case 'GET_SEASON_REJECTED':
    {
      return {
        ...state,
        loading: false,
        selectedSeason: null,
        error: action.payload,
      };
    }
    case 'GET_SEASON_RESULTS':
    {
      return {
        ...state,
      };
    }
    case 'GET_SEASON_RESULTS_FULFILLED':
    {
      return {
        ...state,
        selectedSeason: {
          ...state.selectedSeason,
          results: action.payload,
        },
      };
    }
    case 'GET_SEASON_RESULTS_REJECTED':
    {
      return {
        ...state,
        error: action.payload,
      };
    }
    case 'CREATE_SEASON':
    {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case 'CREATE_SEASON_FULFILLED':
    {
      return {
        ...state,
        message: action.payload,
        loading: false,
      };
    }
    case 'CREATE_SEASON_REJECTED':
    {
      return {
        ...state,
        message: 'Error creating season',
        loading: false,
        error: action.payload,
      };
    }
    case 'UPDATE_SEASON_STATUS':
    {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case 'UPDATE_SEASON_STATUS_FULFILLED':
    {
      return {
        ...state,
        message: action.payload,
        loading: false,
      };
    }
    case 'UPDATE_SEASON_STATUS_REJECTED':
    {
      return {
        ...state,
        message: action.payload.message,
        loading: false,
        error: action.payload.error,
      };
    }
    default: {
      return { ...state };
    }
  }
}
