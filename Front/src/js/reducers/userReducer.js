export default function reducer(state={
    user: {
      id: null,
      name: null
    },
    fetched: false,
    fetching: false,
    error: null,
  }, action) {

    switch (action.type) {
      case "USER_LOGIN": {
        return {...state, fetching: true}
      }
      case "USER_LOGIN_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "USER_LOGIN_FULFILLED": {
        return {
          ...state,
          user: action.payload,
          fetched: true,
          fetching: false
        }
      }
    }

    return state;
}
