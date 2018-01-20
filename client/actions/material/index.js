export const TOGGLE_NAV_DRAWER = 'TOGGLE_NAV_DRAWER';
export const SET_NAV_DRAWER = 'SET_NAV_DRAWER';

/**
 * action creators
 */

export function toggleNavDrawer() {
  return { type: TOGGLE_NAV_DRAWER };
}

export function setNavDrawer(state) {
  return { type: SET_NAV_DRAWER, state };
}
