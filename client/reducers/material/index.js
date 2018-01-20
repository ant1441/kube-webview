import { combineReducers } from 'redux';

import {
  TOGGLE_NAV_DRAWER,
  SET_NAV_DRAWER,
} from '#app/actions/material';

function navDrawer(state = { open: false }, action) {
  switch (action.type) {
  case TOGGLE_NAV_DRAWER:
    return { ...state, open: !state.open };
  case SET_NAV_DRAWER:
    return { ...state, open: action.state };
  default:
    return state;
  }
}

export default combineReducers({
  navDrawer,
});
