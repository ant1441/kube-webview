import { CONFIGMAPS } from '../api';
import { expectJSON, emptyObject } from '#app/utils';

export const REQUEST_CONFIGMAPS = 'REQUEST_CONFIGMAPS';
export const RECEIVE_CONFIGMAPS = 'RECEIVE_CONFIGMAPS';
export const INVALIDATE_CONFIGMAPS = 'INVALIDATE_CONFIGMAPS';

export function requestConfigMaps(namespace) {
  return {
    type: REQUEST_CONFIGMAPS,
    namespace
  }
}

export function receiveConfigMaps(namespace, json) {
  return {
    type: RECEIVE_CONFIGMAPS,
    namespace,
    configmaps: json.items,
    receivedAt: Date.now()
  }
}

export function receiveConfigMapsError(namespace, err) {
  return {
    type: RECEIVE_CONFIGMAPS,
    namespace,
    error: err,
    receivedAt: Date.now()
  }
}

export function invalidateConfigMaps(namespace) {
  return {
    type: INVALIDATE_CONFIGMAPS,
    namespace
  }
}

export function fetchConfigMaps(namespace) {
  return dispatch => {
    dispatch(requestConfigMaps(namespace))
    return fetch(CONFIGMAPS(namespace))
      .then(expectJSON)
      .then(json => dispatch(receiveConfigMaps(namespace, json)))
      .catch((e) => dispatch(receiveConfigMapsError(namespace, e)))
  }
}

export function shouldFetchConfigMaps(state, namespace) {
  const configmaps = state.configmaps[namespace];
  var shouldFetch;
  if (!configmaps) {
    shouldFetch =  true;
  } else if (emptyObject(configmaps)) {
    shouldFetch =  true;
  } else if (configmaps.isFetching) {
    shouldFetch =  false;
  } else {
    shouldFetch = configmaps.didInvalidate;
  }
  return shouldFetch;
}

export function fetchConfigMapsIfNeeded(namespace) {
  return (dispatch, getState) => {
    if (shouldFetchConfigMaps(getState(namespace))) {
      return dispatch(fetchConfigMaps(namespace))
    }
  }
}
