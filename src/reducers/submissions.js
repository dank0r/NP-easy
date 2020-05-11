const submissions = (state={list: [], isLoading: false, error: null}, action) => {
  console.log(action);
  switch (action.type) {
    case 'SUBMIT_SOLUTION_REQUEST':
      return {...state, isLoading: true};
    case 'SUBMIT_SOLUTION_SUCCESS':
      return {...state, isLoading: false, list: state.list.concat(action.payload.data) || state.list};
    case 'SUBMIT_SOLUTION_FAILURE':
      return {...state, isLoading: false, error: 'err'};
    default:
      return state
  }
};

export default submissions;