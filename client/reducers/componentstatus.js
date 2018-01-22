import {
  REQUEST_COMPONENT_STATUS,
  RECEIVE_COMPONENT_STATUS,
  RECEIVE_COMPONENT_STATUS_ERROR,
  INVALIDATE_COMPONENT_STATUS,
} from '#app/actions/componentstatus';

export default function componentStatus(
  state = {
    isFetching: false,
    didInvalidate: true,
    items: []
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_COMPONENT_STATUS:
      const newState0 = Object.assign({}, state, {
        didInvalidate: true,
      })
      delete newState0.error;
      return newState0;
    case REQUEST_COMPONENT_STATUS:
      return {
          ...state,
          isFetching: true,
          didInvalidate: false
      };
    case RECEIVE_COMPONENT_STATUS:
      const newState = Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.componentStatus,
        lastUpdated: action.receivedAt
      });
      delete newState.error;
      return newState;
    case RECEIVE_COMPONENT_STATUS_ERROR:
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
