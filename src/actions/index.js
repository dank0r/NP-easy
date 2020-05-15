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

export function submitSolution({data, filename, userId, token, competitionId}) {
  let type = 'SUBMIT_SOLUTION';
  return {
    types: [`${type}_REQUEST`, `${type}_SUCCESS`, `${type}_FAILURE`],
    payload: {
      request:{
        url:'/',
        method: 'POST',
        data: {
          type,
          data,
          filename,
          userId,
          token,
          competitionId
        }
      }
    }
  }
}

export function fetchSubmissions({ competitionId }) {
  let type = 'FETCH_SUBMISSIONS';
  return {
    types: [`${type}_REQUEST`, `${type}_SUCCESS`, `${type}_FAILURE`],
    payload: {
      request:{
        url:'/',
        method: 'POST',
        data: {
          type,
          competitionId
        }
      }
    }
  }
}

export function joinCompetition({ competitionId, userId, token }) {
  let type = 'JOIN_COMPETITION';
  return {
    types: [`${type}_REQUEST`, `${type}_SUCCESS`, `${type}_FAILURE`],
    payload: {
      request:{
        url:'/',
        method: 'POST',
        data: {
          type,
          competitionId,
          userId,
          token
        }
      }
    }
  }
}

export function fetchCompetitionsOfUser({ userId, token }) {
  let type = 'FETCH_COMPETITIONS';
  return {
    types: [`${type}_OF_USER_REQUEST`, `${type}_OF_USER_SUCCESS`, `${type}_OF_USER_FAILURE`],
    payload: {
      request:{
        url:'/',
        method: 'POST',
        data: {
          type,
          userId,
          token
        }
      }
    }
  }
}

export function fetchUser({ userId }) {
  let type = 'FETCH_USER';
  return {
    types: [`${type}_REQUEST`, `${type}_SUCCESS`, `${type}_FAILURE`],
    payload: {
      request:{
        url:'/',
        method: 'POST',
        data: {
          type,
          userId
        }
      }
    }
  }
}

export function toggleDark() {
  return {
    type: 'TOGGLE_DARK'
  }
}