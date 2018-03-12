import axios from 'axios';
import serverDetails from '../apiDetails';
import phrases from '../../Phrases';


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
          payload: phrases.messages.userCreation,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'CREATE_USER_REJECTED',
          payload: { error, message: phrases.messages.userCreation },
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
    let user = {
      id: undefined, fb_id: fbId, admin: undefined, firstName: undefined, lastName: undefined,
    };
    axios.get(`${serverDetails.baseUrl}users/fb/${fbId}`, { auth: { username: 'id', password: token } })
      .then((response) => {
        if (response.data[0] && response.data !== 'No user profile') {
          [user] = response.data;
          user.token = token;
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
