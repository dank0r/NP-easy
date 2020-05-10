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

export function signIn({username, password}) {
  let type = 'SIGN_IN';
  return {
    types: [`${type}_REQUEST`, `${type}_SUCCESS`, `${type}_FAILURE`],
    payload: {
      request:{
        url:'/',
        method: 'POST',
        data: {
          type,
          username,
          password
        }
      }
    }
  }
}

export function signUp({username, email, password}) {
  let type = 'SIGN_UP';
  return {
    types: [`${type}_REQUEST`, `${type}_SUCCESS`, `${type}_FAILURE`],
    payload: {
      request:{
        url:'/',
        method: 'POST',
        data: {
          type,
          username,
          email,
          password
        }
      }
    }
  }
}

export function signOut({username, token}) {
  let type = 'SIGN_OUT';
  return {
    types: [`${type}_REQUEST`, `${type}_SUCCESS`, `${type}_FAILURE`],
    payload: {
      request:{
        url:'/',
        method: 'POST',
        data: {
          type,
          username,
          token
        }
      }
    }
  }
}

export function authentication({token}) {
  let type = 'AUTHENTICATION';
  return {
    types: [`${type}_REQUEST`, `${type}_SUCCESS`, `${type}_FAILURE`],
    payload: {
      request:{
        url:'/',
        method: 'POST',
        data: {
          type,
          token
        }
      }
    }
  }
}