export default function reducer(state = {
  id: null,
  firstName: '',
  lastName: '',
  admin: null,
  fbId: null,
  token: null,
  fb: {
    details: { firstName: '', lastName: '' },
  },
  loading: false,
  error: null,
}, action) {
  switch (action.type) {
    case 'LOG_IN': {
      return { ...state };
    }
    case 'LOG_IN_FULFILLED': {
      return { ...state, fbId: action.payload.id, token: action.payload.token };
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
        token: action.payload.token,
      };
    }
    case 'FETCH_USER_BY_FB_REJECTED': {
      return { ...state, fbId: null, error: action.payload };
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
    case 'CREATE_USER': {
      return {
        ...state, loading: true, error: null,
      };
    }
    case 'CREATE_USER_FULFILLED': {
      return { ...state, loading: false };
    }
    case 'CREATE_USER_REJECTED': {
      return {
        ...state, loading: false, error: action.payload.error,
      };
    }
    default: {
      return { ...state };
    }
  }
}
