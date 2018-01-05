export default function reducer(state = {
  seasons: [],
  selectedSeason: null,
  loading: true,
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
    default: {
      return { ...state };
    }
  }
}
