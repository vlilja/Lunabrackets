import axios from 'axios';
import serverDetails from '../apiDetails';


export function createUser(user) {
  return (dispatch) => {
    dispatch({
      type: 'CREATE_USER',
      payload: '',
    });
    axios.post(`${serverDetails.baseUrl}users/`, { user })
      .then(() => {
        dispatch({
          type: 'CREATE_USER_FULFILLED',
          payload: '',
        });
      })
      .catch(() => {
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
    let user = {
      id: undefined, fbId, admin: undefined, firstName: undefined, lastName: undefined,
    };
    axios.get(`${serverDetails.baseUrl}users/fb/${fbId}`)
      .then((response) => {
        if (response.data[0]) {
          [user] = response.data;
          user.fbId = fbId;
        }
        dispatch({
          type: 'FETCH_USER_BY_FB_FULFILLED',
          payload: user,
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
