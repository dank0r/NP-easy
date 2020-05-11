import { combineReducers } from 'redux';
import competitions from './competitions';
import users from './users';
import submissions from './submissions';

export default combineReducers({
  competitions,
  users,
  submissions,
});