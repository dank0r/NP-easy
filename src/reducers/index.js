import { combineReducers } from 'redux';
import competitions from './competitions';
import users from './users';
import submissions from './submissions';
import dark from './dark';
import popup from './popup';

export default combineReducers({
  competitions,
  users,
  submissions,
  dark,
  popup,
});