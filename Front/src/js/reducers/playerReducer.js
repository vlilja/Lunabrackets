export default function reducer(state = {
    selectedPlayer: null,
    searchResults: [],
    playerList: [],
    fetched: false,
    fetching: false,
    error: null
  },
  action) {
  switch (action.type) {
    case "FETCH_PLAYERS":
      {
        return { ...state,
          searchResults: [],
          fetching: true
        }
      }
    case "FETCH_PLAYERS_FULFILLED":
      {
        return {
          ...state,
          fetching: false,
          error: null,
          searchResults: action.payload
        }
      }
    case "FETCH_PLAYERS_REJECTED":
      {
        return {
          ...state,
          fetching: false,
          error: action.payload
        }
      }
    case "FETCH_ALL_PLAYERS":
      {
        return { ...state,
          playerList: [],
          fetching: true
        }
      }
    case "FETCH_ALL_PLAYERS_FULFILLED":
      {
        return {
          ...state,
          fetching: false,
          error: null,
          playerList: action.payload
        }
      }
    case "FETCH_ALL_PLAYERS_REJECTED":
      {
        return {
          ...state,
          fetching: false,
          error: action.payload
        }
      }
    case "FETCH_PLAYER":
      {
        return { ...state,
          selectedPlayer: null
        }
      }
    case "FETCH_PLAYER_FULFILLED":
      {
        return {
          ...state,
          error: null,
          selectedPlayer: action.payload
        }
      }
    case "FETCH_PLAYER_REJECTED":
      {
        return {
          ...state,
          error: action.payload
        }
      }
  }
  return state;
}
