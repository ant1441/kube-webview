import {
  REQUEST_CONFIGMAPS,
  RECEIVE_CONFIGMAPS,
  INVALIDATE_CONFIGMAPS,
} from '#app/actions/configmaps';

function configmaps(
  state = {
    isFetching: false,
    didInvalidate: true,
    items: []
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_CONFIGMAPS:
      return { ...state, didInvalidate: true };
    case REQUEST_CONFIGMAPS:
      return {
          ...state,
          isFetching: true,
          didInvalidate: false
      };
    case RECEIVE_CONFIGMAPS:
      return {
          ...state,
          isFetching: false,
          didInvalidate: false,
          items: action.configmaps,
          lastUpdated: action.receivedAt
      };
    default:
      return state;
  }
}

export default function configmapsByNamespace(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_CONFIGMAPS:
    case REQUEST_CONFIGMAPS:
    case RECEIVE_CONFIGMAPS:
      return Object.assign({}, state, {
        [action.namespace]: configmaps(state[action.namespace], action)
      })
    default:
      return state
  }
}
