import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import modals from './modals'

export default combineReducers({
  messages,
  auth,
  modals
});
