import {
  REQUEST_CONFIG_MAPS,
  RECEIVE_CONFIG_MAPS,
  RECEIVE_CONFIG_MAPS_ERROR,
  INVALIDATE_CONFIG_MAPS,
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
    case INVALIDATE_CONFIG_MAPS:
      return { ...state, didInvalidate: true };
    case REQUEST_CONFIG_MAPS:
      return {
          ...state,
          isFetching: true,
          didInvalidate: false
      };
    case RECEIVE_CONFIG_MAPS:
      return {
          ...state,
          isFetching: false,
          didInvalidate: false,
          items: action.configmaps,
          lastUpdated: action.receivedAt
      };
    case RECEIVE_CONFIG_MAPS_ERROR:
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

export default function configmapsByNamespace(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_CONFIG_MAPS:
    case REQUEST_CONFIG_MAPS:
    case RECEIVE_CONFIG_MAPS:
    case RECEIVE_CONFIG_MAPS_ERROR:
      return Object.assign({}, state, {
        [action.namespace]: configmaps(state[action.namespace], action)
      })
    default:
      return state
  }
}
