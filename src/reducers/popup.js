const popup = (state={ open: false, title: '', text: '' }, action) => {
  switch (action.type) {
    case 'POP_UP_SHOW':
      return { open: true, title: action.title, text: action.text };
    case 'POP_UP_HIDE':
      return {...state, open: false};

    default:
      return state
  }
};

export default popup;