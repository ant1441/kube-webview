import { PODS } from '../api';
import { expectJSON, emptyObject } from '#app/utils';

export const REQUEST_PODS = 'REQUEST_PODS';
export const RECEIVE_PODS = 'RECEIVE_PODS';
export const INVALIDATE_PODS = 'INVALIDATE_PODS';

export function requestPods(namespace) {
  return {
    type: REQUEST_PODS,
    namespace
  }
}

export function receivePods(namespace, json) {
  return {
    type: RECEIVE_PODS,
    namespace,
    pods: json.items,
    receivedAt: Date.now()
  }
}

export function receivePodsError(namespace, err) {
  return {
    type: RECEIVE_PODS,
    namespace,
    error: err,
    receivedAt: Date.now()
  }
}

export function invalidatePods(namespace) {
  return {
    type: INVALIDATE_PODS,
    namespace
  }
}

export function fetchPods(namespace) {
  return dispatch => {
    dispatch(requestPods(namespace))
    return fetch(PODS(namespace))
      .then(expectJSON)
      .then(json => dispatch(receivePods(namespace, json)))
      .catch((e) => dispatch(receivePodsError(namespace, e)))
  }
}

export function shouldFetchPods(state, namespace) {
  const pods = state.pods[namespace];
  var shouldFetch;
  if (!pods) {
    shouldFetch =  true;
  } else if (emptyObject(pods)) {
    shouldFetch =  true;
  } else if (pods.isFetching) {
    shouldFetch =  false;
  } else {
    shouldFetch =  pods.didInvalidate;
  }
  return shouldFetch;
}

export function fetchPodsIfNeeded(namespace) {
  return (dispatch, getState) => {
    if (shouldFetchPods(getState(namespace))) {
      return dispatch(fetchPods(namespace))
    }
  }
}
