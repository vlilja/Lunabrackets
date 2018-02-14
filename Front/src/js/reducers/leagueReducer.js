export default function reducer(
  state = {
    selectedLeague: null,
    leagueList: null,
    loading: {
      list: false,
      single: false,
      groups: false,
      update: false,
      result: false,
    },
    creatingLeague: false,
    startingLeague: false,
    message: '',
    showMessage: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case 'CREATE_LEAGUE':
    {
      return {
        ...state,
        creatingLeague: true,
      };
    }
    case 'CREATE_LEAGUE_FULFILLED':
    {
      return {
        ...state,
        error: null,
        creatingLeague: false,
        message: action.payload,
      };
    }
    case 'CREATE_LEAGUE_REJECTED':
    {
      return {
        ...state,
        creatingLeague: false,
        error: action.payload.error,
        message: action.payload.message,
      };
    }
    case 'FETCH_LEAGUE':
    {
      return {
        ...state,
        selectedLeague: null,
        loading: {
          ...state.loading,
          single: true,
        },
      };
    }
    case 'FETCH_LEAGUE_FULFILLED':
    {
      return {
        ...state,
        error: null,
        selectedLeague: action.payload,
        loading: {
          ...state.loading,
          single: false,
        },
      };
    }
    case 'FETCH_LEAGUE_REJECTED':
    {
      return {
        ...state,
        error: action.payload,
        loading: {
          ...state.loading,
          single: false,
        },
      };
    }
    case 'FETCH_ALL_LEAGUES':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          list: true,
        },
      };
    }
    case 'FETCH_ALL_LEAGUES_FULFILLED':
    {
      return {
        ...state,
        error: null,
        leagueList: action.payload,
        loading: {
          ...state.loading,
          list: false,
        },
      };
    }
    case 'FETCH_ALL_LEAGUES_REJECTED':
    {
      return {
        ...state,
        error: action.payload,
        loading: {
          ...state.loading,
          list: false,
        },
      };
    }
    case 'FETCH_ALL_LEAGUE_GROUPS':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          groups: true,
        },
      };
    }
    case 'FETCH_ALL_LEAGUE_GROUPS_FULFILLED':
    {
      return {
        ...state,
        selectedLeague: {
          ...state.selectedLeague,
          groups: action.payload,
        },
        loading: {
          ...state.loading,
          groups: false,
        },
      };
    }
    case 'FETCH_ALL_LEAGUE_GROUPS_REJECTED':
    {
      return {
        ...state,
        error: action.payload,
        loading: {
          ...state.loading,
          groups: false,
        },
      };
    }
    case 'FETCH_LEAGUE_GROUP_RESULTS':
    {
      return {
        ...state,
        error: action.payload,
      };
    }
    case 'FETCH_LEAGUE_GROUP_RESULTS_FULFILLED':
    {
      return {
        ...state,
        selectedLeague: {
          ...state.selectedLeague,
          groupResults: {
            ...state.selectedLeague.groupResults,
            [action.payload.id]: action.payload,
          },
          error: null,
        },
      };
    }
    case 'FETCH_LEAGUE_GROUP_RESULTS_REJECTED':
    {
      return {
        ...state,
        error: action.payload,
      };
    }
    case 'FETCH_UNDETERMINED':
    {
      return { ...state };
    }
    case 'FETCH_UNDETERMINED_FULFILLED':
    {
      return {
        ...state,
        selectedLeague: {
          ...state.selectedLeague,
          undetermined: action.payload,
        },
      };
    }
    case 'FETCH_UNDETERMINED_REJECTED':
    {
      return {
        ...state,
        error: action.payload,
      };
    }
    case 'FETCH_QUALIFIER_MATCHES':
    {
      return { ...state };
    }
    case 'FETCH_QUALIFIER_MATCHES_FULFILLED':
    {
      return {
        ...state,
        selectedLeague: {
          ...state.selectedLeague,
          qualifiers: {
            matches: action.payload,
          },
        },
      };
    }
    case 'FETCH_QUALIFIER_MATCHES_REJECTED':
    {
      return {
        ...state,
        error: action.payload,
      };
    }
    case 'FETCH_ELIMINATION_MATCHES':
    {
      return { ...state };
    }
    case 'FETCH_ELIMINATION_MATCHES_FULFILLED':
    {
      return {
        ...state,
        selectedLeague: {
          ...state.selectedLeague,
          elimination: {
            matches: action.payload,
          },
        },
      };
    }
    case 'FETCH_ELIMINATION_MATCHES_REJECTED':
    {
      return {
        ...state,
        error: action.payload,
      };
    }
    case 'FETCH_FINALS_MATCHES':
    {
      return { ...state };
    }
    case 'FETCH_FINALS_MATCHES_FULFILLED':
    {
      return {
        ...state,
        selectedLeague: {
          ...state.selectedLeague,
          finals: {
            matches: action.payload,
          },
        },
      };
    }
    case 'FETCH_FINALS_MATCHES_REJECTED':
    {
      return {
        ...state,
        error: action.payload,
      };
    }
    case 'FETCH_LEAGUE_RESULTS':
    {
      return {
        ...state,
        loading: { ...state.loading, results: true },
      };
    }
    case 'FETCH_LEAGUE_RESULTS_FULFILLED':
    {
      return {
        ...state,
        selectedLeague: {
          ...state.selectedLeague,
          results: action.payload,
        },
        loading: { ...state.loading, results: false },
        error: null,
      };
    }
    case 'FETCH_LEAGUE_RESULTS_REJECTED':
    {
      return {
        ...state,
        loading: { ...state.loading, results: false },
        error: action.payload,
      };
    }
    case 'START_LEAGUE':
    {
      return {
        ...state,
        loading: { ...state.loading, update: true },
        startingLeague: true,
      };
    }
    case 'START_LEAGUE_FULFILLED':
    {
      return {
        ...state,
        loading: { ...state.loading, update: false },
        message: action.payload,
        startingLeague: false,
      };
    }
    case 'START_LEAGUE_REJECTED':
    {
      return {
        ...state,
        loading: { ...state.loading, update: false },
        error: action.payload.error,
        message: action.payload.message,
        startingLeague: false,
      };
    }
    case 'START_QUALIFIERS':
    {
      return {
        ...state,
        loading: { ...state.loading, update: true },
      };
    }
    case 'START_QUALIFIERS_FULFILLED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: false,
        },
        message: action.payload,
      };
    }
    case 'START_QUALIFIERS_REJECTED':
    {
      return {
        ...state,
        loading: { ...state.loading, update: false },
        error: action.payload,
        message: action.payload.response.data,
      };
    }
    case 'START_FINALS':
    {
      return {
        ...state,
        loading: { ...state.loading, update: true },
      };
    }
    case 'START_FINALS_FULFILLED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: false,
        },
        message: action.payload,
      };
    }
    case 'START_FINALS_REJECTED':
    {
      return {
        ...state,
        loading: { ...state.loading, update: false },
        error: action.payload.error,
        message: action.payload.message,
      };
    }
    case 'FINISH_LEAGUE':
    {
      return {
        ...state,
        loading: { ...state.loading, update: true },
      };
    }
    case 'FINISH_LEAGUE_FULFILLED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: false,
        },
        message: action.payload,
      };
    }
    case 'FINISH_LEAGUE_REJECTED':
    {
      return {
        ...state,
        loading: { ...state.loading, update: false },
        error: action.payload.error,
        message: action.payload.message,
      };
    }
    case 'UPDATE_MATCH':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: true,
        },
        error: null,
      };
    }
    case 'UPDATE_MATCH_FULFILLED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: false,
        },
        error: null,
        message: action.payload,
      };
    }
    case 'UPDATE_MATCH_REJECTED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: false,
        },
        error: action.payload.error,
        message: action.payload.message,
      };
    }
    case 'UPDATE_UNDETERMINED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: true,
        },
      };
    }
    case 'UPDATE_UNDETERMINED_FULFILLED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: false,
        },
        message: action.payload,
      };
    }
    case 'UPDATE_UNDETERMINED_REJECTED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: false,
        },
        error: action.payload,
        message: action.payload.response.data,
      };
    }
    case 'UPDATE_ELIMINATION_MATCH':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: true,
        },
      };
    }
    case 'UPDATE_ELIMINATION_MATCH_FULFILLED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: false,
        },
        message: action.payload,
      };
    }
    case 'UPDATE_ELIMINATION_MATCH_REJECTED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: false,
        },
        error: action.payload,
        message: 'Error updating match',
      };
    }
    case 'UPDATE_QUALIFIER_MATCH':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: true,
        },
      };
    }
    case 'UPDATE_QUALIFIER_MATCH_FULFILLED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: false,
        },
        message: action.payload,
      };
    }
    case 'UPDATE_QUALIFIER_MATCH_REJECTED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: false,
        },
        error: action.payload,
        message: 'Error updating match',
      };
    }
    case 'UPDATE_FINALS_MATCH':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: true,
        },
      };
    }
    case 'UPDATE_FINALS_MATCH_FULFILLED':
    {
      return {
        ...state,
        loading: {
          ...state.loading,
          update: false,
        },
        message: action.payload,
      };
    }
    case 'UPDATE_FINALS_MATCH_REJECTED':
    {
      return {
        ...state,
        ...state.loading,
        update: false,
        error: action.payload,
      };
    }
    case 'SHOW_MESSAGE':
    {
      return {
        ...state,
        showMessage: true,
      };
    }
    case 'HIDE_MESSAGE':
    {
      return {
        ...state,
        showMessage: false,
      };
    }
    default: {
      return { ...state };
    }
  }
}
