import { applyMiddleware, createStore as reduxCreateStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux'

import reducers from './reducers';
import DevTools from '#app/components/dev-tools';

const middlewares = [
  thunkMiddleware,
  routerMiddleware(browserHistory),
];

// Add state logger
if (process.env.NODE_ENV !== 'production') {
  try {
    middlewares.push(createLogger());
  } catch (e) {}
}

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware.apply(null, middlewares),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
);

export function createStore(state) {
  console.log("Store initial state: %o", state);
  return reduxCreateStore(
    reducers,
    state,
    enhancer
  );
}

export let store = null;
export function getStore() { return store; }
export function setAsCurrentStore(s) {
  store = s;
  if (process.env.NODE_ENV !== 'production'
    && typeof window !== 'undefined') {
    window.store = store;
  }
}
