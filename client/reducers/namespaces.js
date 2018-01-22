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
      const newState0 = Object.assign({}, state, {
        didInvalidate: true,
      })
      delete newState0.error;
      return newState0;
    case REQUEST_NAMESPACES:
      return {
          ...state,
          isFetching: true,
          didInvalidate: false
      };
    case RECEIVE_NAMESPACES:
      const newState = Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.namespaces,
        lastUpdated: action.receivedAt
      });
      delete newState.error;
      return newState;
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

