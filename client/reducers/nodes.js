import {
  REQUEST_NODES,
  RECEIVE_NODES,
  RECEIVE_NODES_ERROR,
  INVALIDATE_NODES,
} from '#app/actions/nodes';

export default function nodes(
  state = {
    isFetching: false,
    didInvalidate: true,
    items: []
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_NODES:
      const newState0 = Object.assign({}, state, {
        didInvalidate: true,
      })
      delete newState0.error;
      return newState0;
    case REQUEST_NODES:
      return {
          ...state,
          isFetching: true,
          didInvalidate: false
      };
    case RECEIVE_NODES:
      const newState = Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.nodes,
        lastUpdated: action.receivedAt
      });
      delete newState.error;
      return newState;
    case RECEIVE_NODES_ERROR:
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
