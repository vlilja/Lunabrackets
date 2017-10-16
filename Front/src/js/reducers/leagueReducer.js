export default function reducer(state = {
    selectedLeague: null,
    leagueList: null,
    loading: {
      list: false,
      single: false,
      groups: false,
      update: false
    },
    creatingLeague: false,
    startingLeague: false,
    message: '',
    showMessage: false,
    error: null
  },
  action) {
  switch (action.type) {
    case "CREATE_LEAGUE":
      {
        return { ...state,
          creatingLeague: true
        }
      }
    case "CREATE_LEAGUE_FULFILLED":
      {
        return {
          ...state,
          error: null,
          creatingLeague: false,
          message: action.payload
        }
      }
    case "CREATE_LEAGUE_REJECTED":
      {
        return {
          ...state,
          creatingLeague: false,
          error: action.payload
        }
      }
    case "FETCH_LEAGUE":
      {
        return { ...state,
          selectedLeague: null,
          loading: { ...state.loading,
            single: true
          }
        }
      }
    case "FETCH_LEAGUE_FULFILLED":
      {
        return {
          ...state,
          error: null,
          selectedLeague: action.payload,
          loading: { ...state.loading,
            single: false
          }
        }
      }
    case "FETCH_LEAGUE_REJECTED":
      {
        return {
          ...state,
          error: action.payload,
          loading: { ...state.loading,
            single: false
          }
        }
      }
    case "FETCH_ALL_LEAGUES":
      {
        return { ...state,
          loading: { ...state.loading,
            list: true
          }
        }
      }
    case "FETCH_ALL_LEAGUES_FULFILLED":
      {
        return {
          ...state,
          error: null,
          leagueList: action.payload,
          loading: { ...state.loading,
            list: false
          }
        }
      }
    case "FETCH_ALL_LEAGUES_REJECTED":
      {
        return {
          ...state,
          error: action.payload,
          loading: { ...state.loading,
            list: false
          }
        }
      }
    case "FETCH_ALL_LEAGUE_GROUPS":
      {
        return { ...state,
          loading: { ...state.loading,
            groups: true
          }
        }
      }
    case "FETCH_ALL_LEAGUE_GROUPS_FULFILLED":
      {
        return { ...state,
          selectedLeague: { ...state.selectedLeague,
            groups: action.payload
          },
          loading: { ...state.loading,
            groups: false
          }
        }
      }
    case "FETCH_ALL_LEAGUE_GROUPS_REJECTED":
      {
        return { ...state,
          error: action.payload,
          loading: { ...state.loading,
            groups: false
          }
        }
      }
    case "FETCH_ALL_LEAGUE_GROUP_MATCHES":
      {
        return { ...state
        }
      }
    case "FETCH_ALL_LEAGUE_GROUP_MATCHES_FULFILLED":
      {
        return { ...state,
          selectedLeague: { ...this.state.selectedLeague,
            groups: { ...this.state.selectedLeague.groups,
              [action.payload.id]: group
            }
          }
        }
      }
    case "FETCH_ALL_LEAGUE_GROUP_MATCHES_REJECTED":
      {
        return { ...state,
          error: action.payload
        }
      }
    case "START_LEAGUE":
      {
        return {
          ...state,
          startingLeague: true
        }
      }
    case "START_LEAGUE_FULFILLED":
      {
        return { ...state,
          startingLeague: false
        }
      }
    case "START_LEAGUE_REJECTED":
      {
        return { ...state,
          error: action.payload,
          startingLeague: false
        }
      }
    case "UPDATE_LEAGUE_MATCH":
      {
        return { ...state,
          loading: { ...state.loading,
            update: true
          }
        }
      }
    case "UPDATE_MATCH_FULFILLED":
      {
        return {
          ...state,
          loading: { ...state.loading,
            update: false
          },
          error: null,
          message: action.payload
        }
      }
    case "UPDATE_MATCH_REJECTED":
      {
        return {
          ...state,
          loading: { ...state.loading,
            update: false
          },
          error: action.payload,
          message: 'Error updating match'
        }
      }
    case "SHOW_MESSAGE":
      {
        return { ...state,
          showMessage: true
        }
      }
    case "HIDE_MESSAGE":
      {
        return { ...state,
          showMessage: false
        }
      }
  }
  return state;
}
