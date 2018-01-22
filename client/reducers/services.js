import {
  REQUEST_SERVICES,
  RECEIVE_SERVICES,
  RECEIVE_SERVICES_ERROR,
  INVALIDATE_SERVICES,
} from '#app/actions/services';

function services(
  state = {
    isFetching: false,
    didInvalidate: true,
    items: []
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_SERVICES:
      const newState0 = Object.assign({}, state, {
        didInvalidate: true,
      })
      delete newState0.error;
      return newState0;
    case REQUEST_SERVICES:
      return {
          ...state,
          isFetching: true,
          didInvalidate: false
      };
    case RECEIVE_SERVICES:
      const newState = Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.services,
        lastUpdated: action.receivedAt
      });
      delete newState.error;
      return newState;
    case RECEIVE_SERVICES_ERROR:
      return {
          ...state,
          isFetching: false,
          didInvalidate: false,
          lastUpdated: action.receivedAt,
          error: action.error
      };
    default:
      return state;
  }
}

export default function servicesByNamespace(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SERVICES:
    case REQUEST_SERVICES:
    case RECEIVE_SERVICES:
    case RECEIVE_SERVICES_ERROR:
      return Object.assign({}, state, {
        [action.namespace]: services(state[action.namespace], action)
      })
    default:
      return state
  }
}
