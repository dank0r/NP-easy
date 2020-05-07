export function fetchCompetitions() {
  let type = 'FETCH_COMPETITIONS';
  return {
    types: [`${type}_REQUEST`, `${type}_SUCCESS`, `${type}_FAILURE`],
    payload: {
      request:{
        url:'/',
        method: 'GET'
      }
    }
  }
}