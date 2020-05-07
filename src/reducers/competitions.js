const competitions = (state={list: [], isLoading: false, error: null}, action) => {
  console.log(action);
  switch (action.type) {
    case 'FETCH_COMPETITIONS_REQUEST':
      return {...state, isLoading: true};
    case 'FETCH_COMPETITIONS_SUCCESS':
      return {...state, isLoading: false, list: [...state.list, action.payload.data]};
    case 'FETCH_COMPETITIONS_FAILURE':
      return {...state, isLoading: false, error: 'err'};
    default:
      return state
  }
};

export default competitions;