export default function reducer(state = {
  id: null,
  firstName: '',
  lastName: '',
  admin: null,
  fbId: null,
  fb: {
    details: null,
  },
  error: null,
}, action) {
  switch (action.type) {
    case 'LOG_IN': {
      return { ...state };
    }
    case 'LOG_IN_FULFILLED': {
      return { ...state, fbId: action.payload };
    }
    case 'LOG_IN_REJECTED': {
      return { ...state, error: action.payload };
    }
    case 'LOG_OUT': {
      return { ...state };
    }
    case 'LOG_OUT_FULFILLED': {
      return {
        ...state, fbId: null, id: null, admin: null, error: null,
      };
    }
    case 'LOG_OUT_REJECTED': {
      return { ...state, error: action.payload };
    }
    case 'FETCH_USER_BY_FB': {
      return { ...state };
    }
    case 'FETCH_USER_BY_FB_FULFILLED': {
      return {
        ...state,
        id: action.payload.id,
        fbId: action.payload.fb_id,
        admin: action.payload.admin,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
      };
    }
    case 'FETCH_USER_BY_FB_REJECTED': {
      return { ...state, error: action.payload };
    }
    case 'FETCH_USER_DETAILS_FROM_FB': {
      return { ...state };
    }
    case 'FETCH_USER_DETAILS_FROM_FB_FULFILLED': {
      return { ...state, fb: { details: action.payload } };
    }
    case 'FETCH_USER_DETAILS_FROM_FB_REJECTED': {
      return { ...state, error: action.payload };
    }
    default: {
      return { ...state };
    }
  }
}
