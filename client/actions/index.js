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
  return {
    type: SET_WIDE,
    wide: wide,
  }
}
