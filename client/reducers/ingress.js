import {
  REQUEST_INGRESS,
  RECEIVE_INGRESS,
  RECEIVE_INGRESS_ERROR,
  INVALIDATE_INGRESS,
} from '#app/actions/ingress';

function ingress(
  state = {
    isFetching: false,
    didInvalidate: true,
    items: []
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_INGRESS:
      const newState0 = Object.assign({}, state, {
        didInvalidate: true,
      })
      delete newState0.error;
      return newState0;
    case REQUEST_INGRESS:
      return {
          ...state,
          isFetching: true,
          didInvalidate: false
      };
    case RECEIVE_INGRESS:
      const newState = Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.ingress,
        lastUpdated: action.receivedAt
      });
      delete newState.error;
      return newState;
    case RECEIVE_INGRESS_ERROR:
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

export default function ingressByNamespace(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_INGRESS:
    case REQUEST_INGRESS:
    case RECEIVE_INGRESS:
    case RECEIVE_INGRESS_ERROR:
      return Object.assign({}, state, {
        [action.namespace]: ingress(state[action.namespace], action)
      })
    default:
      return state
  }
}
