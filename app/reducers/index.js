import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import modals from './modals';
import viewPort from './viewPort';

export default combineReducers({
  messages,
  auth,
  modals,
  viewPort
});
