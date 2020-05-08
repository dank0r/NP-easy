const initialList = [

];

const competitions = (state={list: initialList, isLoading: false, error: null}, action) => {
  console.log(action);
  switch (action.type) {
    case 'FETCH_COMPETITIONS_REQUEST':
      return {...state, isLoading: true};
    case 'FETCH_COMPETITIONS_SUCCESS':
      let newList = state.list;
      if(action.payload.data !== null) {
        newList = newList.concat(action.payload.data);
      }
      console.log(newList);
      return {...state, isLoading: false, list: newList};
    case 'FETCH_COMPETITIONS_FAILURE':
      return {...state, isLoading: false, error: 'err'};
    default:
      return state
  }
};

export default competitions;