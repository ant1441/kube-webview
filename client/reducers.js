import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import { SET_CONFIG, SET_NODES } from './actions';

function config(state = {}, action) {
  switch (action.type) {
  case SET_CONFIG:
    return action.config;
  default:
    return state;
  }
}

function nodes(state = {}, action) {
  switch (action.type) {
  case SET_NODES:
    return action.nodes;
  default:
    return state;
  }
}

export default combineReducers({
    config,
    nodes,
    routing: routerReducer
});
