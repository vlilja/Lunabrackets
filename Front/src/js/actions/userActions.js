import axios from 'axios';
import serverDetails from '../apiDetails';


export function createUser(user) {
  return (dispatch) => {
    dispatch({
      type: 'CREATE_USER',
      payload: '',
    });
    axios.post(`${serverDetails.baseUrl}users/`, { user })
      .then((response) => {
        console.log(response);
        dispatch({
          type: 'CREATE_USER_FULFILLED',
          payload: '',
        });
      })
      .catch((error) => {
        dispatch({
          type: 'CREATE_USER_REJECTED',
          payload: '',
        });
      });
  };
}

export function getUserByFb(fbId) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_USER_BY_FB',
      payload: '',
    });
    axios.get(`${serverDetails.baseUrl}users/fb/${fbId}`)
      .then((response) => {
        let userId;
        if (response.data[0]) {
          userId = response.data[0].id;
        }
        dispatch({
          type: 'FETCH_USER_BY_FB_FULFILLED',
          payload: userId,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'FETCH_USER_BY_FB_REJECTED',
          payload: { error, message: 'Unable to fetch user' },
        });
      });
  };
}
