import { NAMESPACES } from '../api';
import { expectJSON, emptyObject } from '#app/utils';

export const SET_SELECTED_NAMESPACE = 'SET_SELECTED_NAMESPACE';
export const REQUEST_NAMESPACES = 'REQUEST_NAMESPACES';
export const RECEIVE_NAMESPACES = 'RECEIVE_NAMESPACES';
export const INVALIDATE_NAMESPACES = 'INVALIDATE_NAMESPACES';

export function setSelectedNamespace(namespace) {
  return {
    type: SET_SELECTED_NAMESPACE,
    namespace
  }
}

export function requestNamespaces() {
  return {
    type: REQUEST_NAMESPACES
  }
}

export function receiveNamespaces(json) {
  return {
    type: RECEIVE_NAMESPACES,
    namespaces: json.items,
    receivedAt: Date.now()
  }
}

export function receiveNamespacesError(err) {
  return {
    type: RECEIVE_NAMESPACES,
    error: err,
    receivedAt: Date.now()
  }
}

export function invalidateNamespaces() {
  return {
    type: INVALIDATE_NAMESPACES,
  }
}

export function fetchNamespaces() {
  return dispatch => {
    dispatch(requestNamespaces())
    return fetch(NAMESPACES)
      .then(expectJSON)
      .then(json => dispatch(receiveNamespaces(json)))
      .catch((e) => dispatch(receiveNamespacesError(e)))
  }
}

export function shouldFetchNamespaces(state) {
  const namespaces = state.namespaces
  var shouldFetch;
  if (!namespaces) {
    shouldFetch =  true;
  } else if (emptyObject(namespaces)) {
    shouldFetch =  true;
  } else if (namespaces.isFetching) {
    shouldFetch =  false;
  } else {
    shouldFetch =  namespaces.didInvalidate;
  }
  return shouldFetch;
}

export function fetchNamespacesIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchNamespaces(getState())) {
      return dispatch(fetchNamespaces())
    }
  }
}
