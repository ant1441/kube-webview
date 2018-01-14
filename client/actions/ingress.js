import { INGRESS } from '../api';
import { expectJSON, emptyObject } from '#app/utils';

export const REQUEST_INGRESS = 'REQUEST_INGRESS';
export const RECEIVE_INGRESS = 'RECEIVE_INGRESS';
export const INVALIDATE_INGRESS = 'INVALIDATE_INGRESS';

export function requestIngress(namespace) {
  return {
    type: REQUEST_INGRESS,
    namespace
  }
}

export function receiveIngress(namespace, json) {
  return {
    type: RECEIVE_INGRESS,
    namespace,
    ingress: json.items,
    receivedAt: Date.now()
  }
}

export function receiveIngressError(namespace, err) {
  return {
    type: RECEIVE_INGRESS,
    namespace,
    error: err,
    receivedAt: Date.now()
  }
}

export function invalidateIngress(namespace) {
  return {
    type: INVALIDATE_INGRESS,
    namespace
  }
}

export function fetchIngress(namespace) {
  return dispatch => {
    dispatch(requestIngress(namespace))
    return fetch(INGRESS(namespace))
      .then(expectJSON)
      .then(json => dispatch(receiveIngress(namespace, json)))
      .catch((e) => dispatch(receiveIngressError(namespace, e)))
  }
}

export function shouldFetchIngress(state, namespace) {
  const ingress = state.ingress[namespace];
  var shouldFetch;
  if (!ingress) {
    shouldFetch =  true;
  } else if (emptyObject(ingress)) {
    shouldFetch =  true;
  } else if (ingress.isFetching) {
    shouldFetch =  false;
  } else {
    shouldFetch =  ingress.didInvalidate;
  }
  return shouldFetch;
}

export function fetchIngressIfNeeded(namespace) {
  return (dispatch, getState) => {
    if (shouldFetchIngress(getState(namespace))) {
      return dispatch(fetchIngress(namespace))
    }
  }
}
