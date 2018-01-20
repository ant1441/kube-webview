/**
 * action types
 */

export const SET_CONFIG = 'SET_CONFIG';
export const SET_WIDE = 'SET_WIDE';

/**
 * action creators
 */

export function setConfig(config) {
  return { type: SET_CONFIG, config };
}

export function setWide(wide) {
  // TODO: Can I store this in a query string for shareable URLs?
  return {
    type: SET_WIDE,
    wide: wide,
  }
}
