import {
  REQUEST_PODS,
  RECEIVE_PODS,
  RECEIVE_PODS_ERROR,
  INVALIDATE_PODS,
} from '#app/actions/pods';

function pods(
  state = {
    isFetching: false,
    didInvalidate: true,
    items: []
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_PODS:
      return { ...state, didInvalidate: true };
    case REQUEST_PODS:
      return {
          ...state,
          isFetching: true,
          didInvalidate: false
      };
    case RECEIVE_PODS:
      return {
          ...state,
          isFetching: false,
          didInvalidate: false,
          items: action.pods,
          lastUpdated: action.receivedAt
      };
    case RECEIVE_PODS_ERROR:
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

export default function podsByNamespace(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_PODS:
    case REQUEST_PODS:
    case RECEIVE_PODS:
    case RECEIVE_PODS_ERROR:
      return Object.assign({}, state, {
        [action.namespace]: pods(state[action.namespace], action)
      })
    default:
      return state
  }
}
