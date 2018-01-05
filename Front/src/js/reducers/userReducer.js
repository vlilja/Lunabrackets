export default function reducer(state = {
  user: {
    id: null,
    name: null,
  },
  users: [],
  searchResults: [],
  fetched: false,
  fetching: false,
  error: null,
}, action) {
  switch (action.type) {
    case 'USER_LOGIN': {
      return { ...state, fetching: true };
    }
    case 'USER_LOGIN_REJECTED': {
      return { ...state, fetching: false, error: action.payload };
    }
    case 'USER_LOGIN_FULFILLED': {
      return {
        ...state,
        user: action.payload,
        fetched: true,
        fetching: false,
      };
    }
    case 'FETCH_USERS_FULFILLED': {
      return {
        ...state,
        users: action.payload,
      };
    }
    case 'FETCH_USERS_REJECTED': {
      return {
        ...state,
        error: action.payload,
      };
    }
    case 'FETCH_PLAYERS': {
      return { ...state, searchResults: [], fetching: true };
    }
    case 'FETCH_PLAYERS_FULFILLED': {
      return {
        ...state,
        fetching: false,
        searchResults: action.payload,
      };
    }
    case 'FETCH_PLAYERS_REJECTED': {
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    }
    default: {
      return { ...state };
    }
  }
}
