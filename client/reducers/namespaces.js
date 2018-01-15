import {
  SET_SELECTED_NAMESPACE,
  REQUEST_NAMESPACES,
  RECEIVE_NAMESPACES,
  RECEIVE_NAMESPACES_ERROR,
  INVALIDATE_NAMESPACES,
} from '#app/actions/namespaces';

export default function namespaces(
  state = {
    selectedNamespace: "default",
    isFetching: false,
    didInvalidate: true,
    items: []
  },
  action
) {
  switch (action.type) {
    case SET_SELECTED_NAMESPACE:
      return { ...state, selectedNamespace: action.namespace };
    case INVALIDATE_NAMESPACES:
      return { ...state, didInvalidate: true };
    case REQUEST_NAMESPACES:
      return {
          ...state,
          isFetching: true,
          didInvalidate: false
      };
    case RECEIVE_NAMESPACES:
      return {
          ...state,
          isFetching: false,
          didInvalidate: false,
          items: action.namespaces,
          lastUpdated: action.receivedAt
      };
    case RECEIVE_NAMESPACES_ERROR:
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

