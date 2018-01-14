import {
  REQUEST_INGRESS,
  RECEIVE_INGRESS,
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
      return { ...state, didInvalidate: true };
    case REQUEST_INGRESS:
      return {
          ...state,
          isFetching: true,
          didInvalidate: false
      };
    case RECEIVE_INGRESS:
      return {
          ...state,
          isFetching: false,
          didInvalidate: false,
          items: action.ingress,
          lastUpdated: action.receivedAt
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
      return Object.assign({}, state, {
        [action.namespace]: ingress(state[action.namespace], action)
      })
    default:
      return state
  }
}
