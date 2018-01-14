import {
  REQUEST_NODES,
  RECEIVE_NODES,
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
    default:
      return state;
  }
}
