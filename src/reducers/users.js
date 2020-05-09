const competitions = (state={list: []}, action) => {
  console.log(action);
  switch (action.type) {
    case 'LOG_IN_REQUEST':
      return {...state, isLoading: true};
    case 'LOG_IN_SUCCESS':
      return {...state, isLoading: false, list: action.payload.data || state.list};
    case 'LOG_IN_FAILURE':
      return {...state, isLoading: false, error: 'err'};
    default:
      return state
  }
};

export default competitions;