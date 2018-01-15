import { NODES } from '../api';
import { expectJSON, emptyObject } from '#app/utils';

export const REQUEST_NODES = 'REQUEST_NODES';
export const RECEIVE_NODES = 'RECEIVE_NODES';
export const RECEIVE_NODES_ERROR = 'RECEIVE_NODES_ERROR';
export const INVALIDATE_NODES = 'INVALIDATE_NODES';

export function requestNodes() {
  return {
    type: REQUEST_NODES
  }
}

export function receiveNodes(json) {
  return {
    type: RECEIVE_NODES,
    nodes: json.items,
    receivedAt: Date.now()
  }
}

export function receiveNodesError(err) {
  return {
    type: RECEIVE_NODES_ERROR,
    error: err,
    receivedAt: Date.now()
  }
}

export function invalidateNodes() {
  return {
    type: INVALIDATE_NODES,
  }
}

export function fetchNodes() {
  return dispatch => {
    dispatch(requestNodes())
    return fetch(NODES)
      .then(expectJSON)
      .then(json => dispatch(receiveNodes(json)))
      .catch((e) => dispatch(receiveNodesError(e)))
  }
}

export function shouldFetchNodes(state) {
  const nodes = state.nodes
  var shouldFetch;
  if (!nodes) {
    shouldFetch =  true;
  } else if (emptyObject(nodes)) {
    shouldFetch =  true;
  } else if (nodes.isFetching) {
    shouldFetch =  false;
  } else {
    shouldFetch =  nodes.didInvalidate;
  }
  return shouldFetch;
}

export function fetchNodesIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchNodes(getState())) {
      return dispatch(fetchNodes())
    }
  }
}
