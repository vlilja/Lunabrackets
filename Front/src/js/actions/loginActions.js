

const { FB } = window;

let userId;

FB.init({
  appId: '127635724454601',
  autoLogAppEvents: true,
  xfbml: true,
  version: 'v2.12',
});

export function checkLoginStatus() {
  FB.getLoginStatus((response) => {
    console.log(response);
    if (response.status === 'connected') {
      userId = response.authResponse.userID;
      console.log('Logged in.');
    } else {
      FB.login();
    }
  });
}

export function getUserDetails() {
  FB.api('/me', {fields: 'first_name, last_name'}, function(response) {

  });
}
