const competitions = (state={list: [], isLoading: false, error: null}, action) => {
  switch (action.type) {
    case 'SIGN_IN_REQUEST':
      return {...state, isLoading: true};
    case 'SIGN_IN_SUCCESS':
      return {...state, isLoading: false, list: state.list.concat({...action.payload.data.user, id: +action.payload.data.user.id, isMe: true})};
    case 'SIGN_IN_FAILURE':
      return {...state, isLoading: false, error: action.error.response.statusText};

    case 'SIGN_UP_REQUEST':
      return {...state, isLoading: true};
    case 'SIGN_UP_SUCCESS':
      return {...state, isLoading: false, list: state.list.concat({...action.payload.data.user, id: +action.payload.data.user.id, isMe: true})};
    case 'SIGN_UP_FAILURE':
      return {...state, isLoading: false, error: action.error.response.statusText};

    case 'SIGN_OUT_REQUEST':
      return {...state, isLoading: true, list: state.list.filter(u => !u.isMe)};
    case 'SIGN_OUT_SUCCESS':
      return {...state, isLoading: false};
    case 'SIGN_OUT_FAILURE':
      return {...state, isLoading: false, error: action.error.response.statusText};

    case 'AUTHENTICATION_REQUEST':
      return {...state, isLoading: true};
    case 'AUTHENTICATION_SUCCESS':
      return {...state, isLoading: false, list: state.list.concat({...action.payload.data.user, id: +action.payload.data.user.id, isMe: true})};
    case 'AUTHENTICATION_FAILURE':
      return {...state, isLoading: false, error: action.error.data};

    case 'FETCH_USER_REQUEST':
      return {...state, isLoading: true};
    case 'FETCH_USER_SUCCESS':
      return {...state, isLoading: false, list: state.list.concat({...action.payload.data, id: +action.payload.data.id})};
    case 'FETCH_USER_FAILURE':
      return {...state, isLoading: false, error: action.error.response.statusText};
    default:
      return state
  }
};

export default competitions;