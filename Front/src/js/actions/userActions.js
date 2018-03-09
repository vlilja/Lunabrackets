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

export function getUserByFb(fbId, token) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_USER_BY_FB',
      payload: '',
    });
    console.log(`tolken${token}`);
    let user = {
      id: undefined, fb_id: fbId, admin: undefined, firstName: undefined, lastName: undefined,
    };
    axios.get(`${serverDetails.baseUrl}users/fb/${fbId}`, { auth: { username: 'id', password: token } })
      .then((response) => {
        if (response.data[0]) {
          [user] = response.data;
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
