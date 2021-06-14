import { all } from 'redux-saga/effects';
import order from './order';

export default function* indexSaga() {
  yield all([order()]);
}
