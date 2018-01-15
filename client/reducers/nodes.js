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
      return { ...state, didInvalidate: true };
    case REQUEST_NODES:
      return {
          ...state,
          isFetching: true,
          didInvalidate: false
      };
    case RECEIVE_NODES:
      return {
          ...state,
          isFetching: false,
          didInvalidate: false,
          items: action.nodes,
          lastUpdated: action.receivedAt
      };
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
