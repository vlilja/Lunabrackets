import axios from 'axios';
import serverDetails from '../apiDetails';

export function fetchUser(userDetails) {
  return (dispatch) => {
    axios.post(`${serverDetails.baseUrl}user/login`, {
      name: userDetails.name,
      password: userDetails.password,
    })
      .then((response) => {
        dispatch({
          type: 'USER_LOGIN_FULFILLED',
          payload: response.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: 'USER_LOGIN_REJECTED',
          payload: err,
        });
      });
  };
}

export function fetchUsers() {
  return (dispatch) => {
    axios.get(`${serverDetails.baseUrl}/users`)
      .then((response) => {
        dispatch({
          type: 'FETCH_USERS_FULFILLED',
          payload: response.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: 'FETCH_USERS_REJECTED',
          payload: err,
        });
      });
  };
}
