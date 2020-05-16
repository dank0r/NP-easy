/*
const initialList = [{
  id: 1,
  userId: 1,
  compiler: "c++",
  submissionDateTime: "07.05.2020 23:21",
  status: "testing",
  result: "",
  time: "",
  competitionId: 1,
}];
*/
const submissions = (state={list: [], isLoading: false, error: null}, action) => {
  switch (action.type) {
    case 'SUBMIT_SOLUTION_REQUEST':
      return {...state, isLoading: true};
    case 'SUBMIT_SOLUTION_SUCCESS':
      return {...state, isLoading: false};
    case 'SUBMIT_SOLUTION_FAILURE':
      return {...state, isLoading: false, error: 'err'};

    case 'FETCH_SUBMISSIONS_REQUEST':
      return {...state, isLoading: true};
    case 'FETCH_SUBMISSIONS_SUCCESS':
      return {...state, isLoading: false, list: state.list.filter(s => s.competitionId !== action.meta.previousAction.payload.request.data.competitionId)
          .concat(action.payload.data)};
    case 'FETCH_SUBMISSIONS_FAILURE':
      return {...state, isLoading: false, error: 'err'};
    default:
      return state
  }
};

export default submissions;