/**
 * action types
 */

export const SET_CONFIG = 'SET_CONFIG';
export const SET_NODES = 'SET_NODES';

/**
 * action creators
 */

export function setConfig(config) {
  return { type: SET_CONFIG, config };
}

export function setNodes(nodes) {
  return { type: SET_NODES, nodes };
}
