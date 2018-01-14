import { SERVICES } from '../api';
import { expectJSON, emptyObject } from '#app/utils';

export const REQUEST_SERVICES = 'REQUEST_SERVICES';
export const RECEIVE_SERVICES = 'RECEIVE_SERVICES';
export const INVALIDATE_SERVICES = 'INVALIDATE_SERVICES';

export function requestServices(namespace) {
  return {
    type: REQUEST_SERVICES,
    namespace
  }
}

export function receiveServices(namespace, json) {
  return {
    type: RECEIVE_SERVICES,
    namespace,
    services: json.items,
    receivedAt: Date.now()
  }
}

export function receiveServicesError(namespace, err) {
  return {
    type: RECEIVE_SERVICES,
    namespace,
    error: err,
    receivedAt: Date.now()
  }
}

export function invalidateServices(namespace) {
  return {
    type: INVALIDATE_SERVICES,
    namespace
  }
}

export function fetchServices(namespace) {
  return dispatch => {
    dispatch(requestServices(namespace))
    return fetch(SERVICES(namespace))
      .then(expectJSON)
      .then(json => dispatch(receiveServices(namespace, json)))
      .catch((e) => dispatch(receiveServicesError(namespace, e)))
  }
}

export function shouldFetchServices(state, namespace) {
  const services = state.services[namespace];
  var shouldFetch;
  if (!services) {
    shouldFetch =  true;
  } else if (emptyObject(services)) {
    shouldFetch =  true;
  } else if (services.isFetching) {
    shouldFetch =  false;
  } else {
    shouldFetch =  services.didInvalidate;
  }
  return shouldFetch;
}

export function fetchServicesIfNeeded(namespace) {
  return (dispatch, getState) => {
    if (shouldFetchServices(getState(namespace))) {
      return dispatch(fetchServices(namespace))
    }
  }
}
