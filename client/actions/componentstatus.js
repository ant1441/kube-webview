import { COMPONENT_STATUS } from '../api';
import { expectJSON, emptyObject } from '#app/utils';

export const REQUEST_COMPONENT_STATUS = 'REQUEST_COMPONENT_STATUS';
export const RECEIVE_COMPONENT_STATUS = 'RECEIVE_COMPONENT_STATUS';
export const RECEIVE_COMPONENT_STATUS_ERROR = 'RECEIVE_COMPONENT_STATUS_ERROR';
export const INVALIDATE_COMPONENT_STATUS = 'INVALIDATE_COMPONENT_STATUS';

export function requestComponentStatus() {
  return {
    type: REQUEST_COMPONENT_STATUS
  }
}

export function receiveComponentStatus(json) {
  return {
    type: RECEIVE_COMPONENT_STATUS,
    componentStatus: json.items,
    receivedAt: Date.now()
  }
}

export function receiveComponentStatusError(err) {
  return {
    type: RECEIVE_COMPONENT_STATUS_ERROR,
    error: err,
    receivedAt: Date.now()
  }
}

export function invalidateComponentStatus() {
  return {
    type: INVALIDATE_COMPONENT_STATUS,
  }
}

export function fetchComponentStatus() {
  return dispatch => {
    dispatch(requestComponentStatus())
    return fetch(COMPONENT_STATUS)
      .then(expectJSON)
      .then(json => dispatch(receiveComponentStatus(json)))
      .catch((e) => dispatch(receiveComponentStatusError(e)))
  }
}

export function shouldFetchComponentStatus(state) {
  const componentStatus = state.componentStatus
  var shouldFetch;
  if (!componentStatus) {
    shouldFetch =  true;
  } else if (emptyObject(componentStatus)) {
    shouldFetch =  true;
  } else if (componentStatus.isFetching) {
    shouldFetch =  false;
  } else {
    shouldFetch =  componentStatus.didInvalidate;
  }
  return shouldFetch;
}

export function fetchComponentStatusIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchComponentStatus(getState())) {
      return dispatch(fetchComponentStatus())
    }
  }
}
