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
      return { ...state, didInvalidate: true };
    case REQUEST_COMPONENT_STATUS:
      return {
          ...state,
          isFetching: true,
          didInvalidate: false
      };
    case RECEIVE_COMPONENT_STATUS:
      return {
          ...state,
          isFetching: false,
          didInvalidate: false,
          items: action.componentStatus,
          lastUpdated: action.receivedAt
      };
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
