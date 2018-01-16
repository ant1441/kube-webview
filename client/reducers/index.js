import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import { SET_CONFIG, SET_NODES, SET_WIDE } from '#app/actions';
import nodes from './nodes';
import namespaces from './namespaces';
import pods from './pods';
import services from './services';
import ingress from './ingress';
import configMaps from './configmaps';
import clusterrolebindings from './clusterrolebindings';
import componentStatus from './componentstatus';

function config(state = { wide: false }, action) {
  switch (action.type) {
  case SET_CONFIG:
    return { state, ...action.config };
    case SET_WIDE:
      return { ...state, wide: action.wide };
  default:
    return state;
  }
}

export default combineReducers({
    config,
    nodes,
    namespaces,
    pods,
    services,
    ingress,
    configMaps,
    clusterrolebindings,
    componentStatus,
    routing: routerReducer
});
