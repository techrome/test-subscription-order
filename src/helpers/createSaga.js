import axios from 'axios';
import { takeLatest, call, put, cancelled, all } from 'redux-saga/effects';

import { defaultErrorText, isdev } from 'src/config';
import { alertsActions } from 'src/redux/stores/alerts';

export function createLoadingSaga({
  sagaName,
  handlerName,
  apiUrl,
  watchType,
  successType,
  errorType,
  resetTypes = [],
  paramsExtractor,
  apiUrlExtractor,
  responseExtractor,
}) {
  function* api({ params, cancelToken }) {
    try {
      const url = apiUrlExtractor ? apiUrlExtractor(params) : apiUrl;
      const res = yield axios.get(url, { cancelToken });

      isdev && console.log(`response from ${sagaName} ${handlerName} api`, res);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  function* handler(action) {
    if (resetTypes.includes(action.type)) {
      // just stops current saga
      return;
    }

    const cancelSource = axios.CancelToken.source();
    try {
      const params = paramsExtractor ? paramsExtractor(action) : null;

      const response = yield call(api, {
        params,
        cancelToken: cancelSource.token,
      });

      yield put({
        type: successType,
        payload: responseExtractor ? responseExtractor(response) : response,
      });
    } catch (err) {
      isdev && console.log(`err from ${sagaName} ${handlerName} handler`, err);

      if (err && err.message && !err.response) {
        isdev &&
          console.error(
            `err.message from ${sagaName} ${handlerName} handler!`,
            err.message,
          );

        yield all([
          put({
            type: errorType,
            payload: {},
          }),
          put(
            alertsActions.addAlert({
              message: err.message,
              options: {
                variant: 'error',
              },
            }),
          ),
        ]);
        return;
      }

      if (!err || !err.response) {
        isdev &&
          console.error(
            `no err or err.response from ${sagaName} ${handlerName} handler!`,
          );

        yield all([
          put({
            type: errorType,
            payload: {},
          }),
          put(
            alertsActions.addAlert({
              message: defaultErrorText,
              options: {
                variant: 'error',
              },
            }),
          ),
        ]);
        return;
      }

      isdev &&
        console.log(
          `err.response from ${sagaName} ${handlerName} handler`,
          err.response,
        );

      switch (err.response.status) {
        default: {
          yield all([
            put({
              type: errorType,
              payload: {},
            }),
            put(
              alertsActions.addAlert({
                message: err.response.data || defaultErrorText,
                options: {
                  variant: 'error',
                },
              }),
            ),
          ]);
          break;
        }
      }
    } finally {
      if (yield cancelled()) {
        yield call(cancelSource.cancel);
      }
    }
  }

  return function* watcher() {
    yield takeLatest([watchType, ...resetTypes], handler);
  };
}

// REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING
// REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING
// REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING
// REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING REQUESTING

export function createRequestingSaga({
  sagaName,
  handlerName,
  method = 'post',
  methodExtractor,
  apiUrl,
  watchType,
  successType,
  errorType,
  resetTypes = [],
  paramsExtractor,
  apiUrlExtractor,
  withValidation,
  validationFunction,
  isFormData,
  modifyPayload,
}) {
  function* api({ payload, params, cancelToken }) {
    try {
      const url = apiUrlExtractor ? apiUrlExtractor(params) : apiUrl;
      const _method = methodExtractor ? methodExtractor(params) : method;
      let res;
      if (['get', 'delete'].includes(_method)) {
        res = yield axios[_method](url, { cancelToken });
      } else {
        res = yield axios[_method](url, payload, {
          cancelToken,
          ...(isFormData && {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }),
        });
      }

      isdev && console.log(`res from ${sagaName} ${handlerName} api`, res);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  function* handler(action) {
    if (resetTypes.includes(action.type)) {
      return;
      // just stops current saga
    }

    const cancelSource = axios.CancelToken.source();
    try {
      if (withValidation && validationFunction) {
        const localValidations = validationFunction(action.payload, action);

        if (localValidations) {
          yield put({
            type: errorType,
            payload: {
              validations: localValidations,
            },
          });
          return;
        }
      }

      const params = paramsExtractor ? paramsExtractor(action) : null;

      const response = yield call(api, {
        payload: modifyPayload ? modifyPayload(action.payload) : action.payload,
        params,
        cancelToken: cancelSource.token,
      });

      yield put({
        type: successType,
        payload: response,
      });
      if (yield cancelled()) {
        return;
      }
      action.onSuccess?.(response);
    } catch (err) {
      isdev && console.log(`err from ${sagaName} ${handlerName} handler`, err);

      if (err && err.message && !err.response) {
        isdev &&
          console.error(`err.message from ${sagaName} ${handlerName} handler!`);

        yield all([
          put({
            type: errorType,
            payload: {},
          }),
          put(
            alertsActions.addAlert({
              message: err.message,
              options: {
                variant: 'error',
              },
            }),
          ),
        ]);
        return;
      }

      if (!err || !err.response) {
        isdev &&
          console.error(
            `no err or err.response from ${sagaName} ${handlerName} handler!`,
          );

        yield all([
          put({
            type: errorType,
            payload: {},
          }),
          put(
            alertsActions.addAlert({
              message: defaultErrorText,
              options: {
                variant: 'error',
              },
            }),
          ),
        ]);
        return;
      }

      isdev &&
        console.log(
          `err.response from ${sagaName} ${handlerName} handler`,
          err.response,
        );

      switch (err.response.status) {
        default: {
          yield all([
            put({
              type: errorType,
              payload: {},
            }),
            put(
              alertsActions.addAlert({
                message: err.response.data || defaultErrorText,
                options: {
                  variant: 'error',
                },
              }),
            ),
          ]);
          break;
        }
      }
    } finally {
      if (yield cancelled()) {
        yield call(cancelSource.cancel);
      }
    }
  }

  return function* watcher() {
    yield takeLatest([watchType, ...resetTypes], handler);
  };
}
