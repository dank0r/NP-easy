const dark = (state=false, action) => {
  switch (action.type) {
    case 'TOGGLE_DARK':
      return !state;

    default:
      return state
  }
};

export default dark;