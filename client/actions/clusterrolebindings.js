import { CLUSTER_ROLE_BINDINGS } from '../api';
import { expectJSON, emptyObject } from '#app/utils';

export const REQUEST_CLUSTER_ROLE_BINDINGS = 'REQUEST_CLUSTER_ROLE_BINDINGS';
export const RECEIVE_CLUSTER_ROLE_BINDINGS = 'RECEIVE_CLUSTER_ROLE_BINDINGS';
export const RECEIVE_CLUSTER_ROLE_BINDINGS_ERROR = 'RECEIVE_CLUSTER_ROLE_BINDINGS_ERROR';
export const INVALIDATE_CLUSTER_ROLE_BINDINGS = 'INVALIDATE_CLUSTER_ROLE_BINDINGS';

export function requestClusterRoleBindings() {
  return {
    type: REQUEST_CLUSTER_ROLE_BINDINGS
  }
}

export function receiveClusterRoleBindings(json) {
  return {
    type: RECEIVE_CLUSTER_ROLE_BINDINGS,
    clusterRoleBindings: json.items,
    receivedAt: Date.now()
  }
}

export function receiveClusterRoleBindingsError(err) {
  return {
    type: RECEIVE_CLUSTER_ROLE_BINDINGS_ERROR,
    error: err,
    receivedAt: Date.now()
  }
}

export function invalidateClusterRoleBindings() {
  return {
    type: INVALIDATE_CLUSTER_ROLE_BINDINGS,
  }
}

export function fetchClusterRoleBindings() {
  return dispatch => {
    dispatch(requestClusterRoleBindings())
    return fetch(CLUSTER_ROLE_BINDINGS)
      .then(expectJSON)
      .then((json) => dispatch(receiveClusterRoleBindings(json)))
      .catch((e) => dispatch(receiveClusterRoleBindingsError(e)))
  }
}

export function shouldFetchClusterRoleBindings(state) {
  const clusterRoleBindings = state.clusterRoleBindings
  var shouldFetch;
  if (!clusterRoleBindings) {
    shouldFetch =  true;
  } else if (emptyObject(clusterRoleBindings)) {
    shouldFetch =  true;
  } else if (clusterRoleBindings.isFetching) {
    shouldFetch =  false;
  } else {
    shouldFetch =  clusterRoleBindings.didInvalidate;
  }
  return shouldFetch;
}

export function fetchClusterRoleBindingsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchClusterRoleBindings(getState())) {
      return dispatch(fetchClusterRoleBindings())
    }
  }
}
