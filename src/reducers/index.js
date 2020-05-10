import { combineReducers } from 'redux';
import competitions from './competitions';
import users from './users';

export default combineReducers({
  competitions,
  users,
});