import axios from "axios";

export function getUser() {
  type
}

export function fetchUser(userDetails) {
  return function(dispatch) {
    axios.post("http://localhost:3001/api/user/login", {
      name:userDetails.name,
      password:userDetails.password
    })
    .then((response) => {
      dispatch({type: "USER_LOGIN_FULFILLED", payload: response.data})
    })
    .catch((err) => {
      dispatch({type: "USER_LOGIN_REJECTED", payload: err})
    })
  }
}
