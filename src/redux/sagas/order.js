import { all, fork } from 'redux-saga/effects';

import {
  createLoadingSaga,
  createRequestingSaga,
} from 'src/helpers/createSaga';
import { orderTypes } from 'src/redux/stores/order';

function* rootWatcher() {
  yield all([
    fork(
      createLoadingSaga({
        sagaName: 'order',
        handlerName: 'get subscription plans',
        apiUrl: 'https://cloud-storage-prices-moberries.herokuapp.com/prices',
        watchType: orderTypes.SUBSCRIPTION_PLANS_LOAD,
        successType: orderTypes.SUBSCRIPTION_PLANS_LOAD_SUCCESS,
        errorType: orderTypes.SUBSCRIPTION_PLANS_LOAD_ERROR,
        resetTypes: [orderTypes.SUBSCRIPTION_PLANS_LOAD_RESET],
      }),
    ),
    fork(
      createRequestingSaga({
        sagaName: 'order',
        handlerName: 'post order',
        apiUrl: 'https://httpbin.org/post',
        watchType: orderTypes.ORDER_REQUEST,
        successType: orderTypes.ORDER_REQUEST_SUCCESS,
        errorType: orderTypes.ORDER_REQUEST_ERROR,
        resetTypes: [orderTypes.ORDER_REQUEST_RESET],
      }),
    ),
  ]);
}

export default rootWatcher;
