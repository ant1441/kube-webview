import {
  REQUEST_CLUSTER_ROLE_BINDINGS,
  RECEIVE_CLUSTER_ROLE_BINDINGS,
  RECEIVE_CLUSTER_ROLE_BINDINGS_ERROR,
  INVALIDATE_CLUSTER_ROLE_BINDINGS,
} from '#app/actions/clusterrolebindings';

export default function clusterRoleBindings(
  state = {
    isFetching: false,
    didInvalidate: true,
    items: []
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_CLUSTER_ROLE_BINDINGS:
      const newState0 = Object.assign({}, state, {
        didInvalidate: true,
      })
      delete newState0.error;
      return newState0;
    case REQUEST_CLUSTER_ROLE_BINDINGS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      };
    case RECEIVE_CLUSTER_ROLE_BINDINGS:
      const newState = Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.clusterRoleBindings,
        lastUpdated: action.receivedAt
      });
      delete newState.error;
      return newState;
    case RECEIVE_CLUSTER_ROLE_BINDINGS_ERROR:
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
