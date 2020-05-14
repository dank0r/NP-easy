const competitions = (state={list: [], myCompetitions: [], isLoading: false, error: null}, action) => {
  console.log(action);
  switch (action.type) {
    case 'FETCH_COMPETITIONS_REQUEST':
      return {...state, isLoading: true};
    case 'FETCH_COMPETITIONS_SUCCESS':
      return {...state, isLoading: false, list: action.payload.data || state.list};
    case 'FETCH_COMPETITIONS_FAILURE':
      return {...state, isLoading: false, error: 'err'};

    case 'FETCH_COMPETITIONS_OF_USER_REQUEST':
      return {...state, isLoading: true};
    case 'FETCH_COMPETITIONS_OF_USER_SUCCESS':
      return {...state, isLoading: false, myCompetitions: state.myCompetitions.concat(action.payload.data.competitions
          .filter(idNew => !state.myCompetitions.some(idOld => idOld === idNew)))};
    case 'FETCH_COMPETITIONS_OF_USER_FAILURE':
      return {...state, isLoading: false, error: 'err'};

    case 'SIGN_OUT_REQUEST':
      return {...state, myCompetitions: []};
    default:
      return state
  }
};

export default competitions;