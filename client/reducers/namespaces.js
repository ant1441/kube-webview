import {
  SET_SELECTED_NAMESPACE,
  REQUEST_NAMESPACES,
  RECEIVE_NAMESPACES,
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
    default:
      return state;
  }
}

