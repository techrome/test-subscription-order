import { combineReducers } from 'redux';
import alerts from './alerts';
import order from './order';
import modal from './modal';

export default combineReducers({
  alerts,
  order,
  modal,
});
