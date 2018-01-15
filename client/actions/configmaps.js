import { CONFIG_MAPS } from '../api';
import { expectJSON, emptyObject } from '#app/utils';

export const REQUEST_CONFIG_MAPS = 'REQUEST_CONFIG_MAPS';
export const RECEIVE_CONFIG_MAPS = 'RECEIVE_CONFIG_MAPS';
export const RECEIVE_CONFIG_MAPS_ERROR = 'RECEIVE_CONFIG_MAPS_ERROR';
export const INVALIDATE_CONFIG_MAPS = 'INVALIDATE_CONFIG_MAPS';

export function requestConfigMaps(namespace) {
  return {
    type: REQUEST_CONFIG_MAPS,
    namespace
  }
}

export function receiveConfigMaps(namespace, json) {
  return {
    type: RECEIVE_CONFIG_MAPS,
    namespace,
    configmaps: json.items,
    receivedAt: Date.now()
  }
}

export function receiveConfigMapsError(namespace, err) {
  return {
    type: RECEIVE_CONFIG_MAPS_ERROR,
    namespace,
    error: err,
    receivedAt: Date.now()
  }
}

export function invalidateConfigMaps(namespace) {
  return {
    type: INVALIDATE_CONFIG_MAPS,
    namespace
  }
}

export function fetchConfigMaps(namespace) {
  return dispatch => {
    dispatch(requestConfigMaps(namespace))
    return fetch(CONFIG_MAPS(namespace))
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
