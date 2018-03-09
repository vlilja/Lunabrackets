import { getUserByFb } from './userActions';

const { FB } = window;

FB.init({
  appId: '127635724454601',
  autoLogAppEvents: true,
  xfbml: true,
  version: 'v2.12',
  cookie: true,
});

export function logIn() {
  return (dispatch) => {
    dispatch({
      type: 'LOG_IN',
      payload: '',
    });
    FB.login((response) => {
      if (response.status === 'connected') {
        dispatch(getUserByFb(response.authResponse.userID, response.authResponse.accessToken));
        dispatch({
          type: 'LOG_IN_FULFILLED',
          payload: { id: response.authResponse.userID, token: response.authResponse.accessToken },
        });
      } else {
        dispatch({
          type: 'LOG_IN_REJECTED',
          payload: 'user not connected',
        });
      }
    });
  };
}


export function logOut() {
  return (dispatch) => {
    dispatch({
      type: 'LOG_OUT',
      payload: '',
    });
    FB.logout((response) => {
      if (response.status === 'unknown') {
        dispatch({
          type: 'LOG_OUT_FULFILLED',
          payload: '',
        });
      } else {
        dispatch({
          type: 'LOG_OUT_REJECTED',
          payload: 'Error logging user out',
        });
      }
      window.location = '/';
    });
  };
}

export function getFacebookUserDetails() {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_USER_DETAILS_FROM_FB',
      payload: '',
    });
    FB.api('/me', { fields: 'first_name, last_name, email' }, (response) => {
      if (response.error) {
        dispatch({
          type: 'FETCH_USER_DETAILS_FROM_FB_REJECTED',
          payload: response.error.message,
        });
      } else {
        dispatch({
          type: 'FETCH_USER_DETAILS_FROM_FB_FULFILLED',
          payload: { firstName: response.first_name, lastName: response.last_name, email: response.email },
        });
      }
    });
  };
}

export function checkLoginStatus() {
  return (dispatch) => {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        dispatch(getUserByFb(response.authResponse.userID, response.authResponse.accessToken));
      }
    });
  };
}
