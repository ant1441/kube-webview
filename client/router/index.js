import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux'
import { MuiThemeProvider } from 'material-ui/styles';
import { Promise } from 'when';

import toString from './toString';
import createRoutes from './routes';
import { createStore, setAsCurrentStore } from '../store';
import getTheme from '../material';


export function run() {
  // init promise polyfill
  window.Promise = window.Promise || Promise;
  // init fetch polyfill
  window.self = window;
  require('whatwg-fetch');

  // TODO: Figure out why this doesn't set nodes
  const store = createStore(window['--app-initial']);
  setAsCurrentStore(store);

  // Create an enhanced history that syncs navigation events with the store
  const history = syncHistoryWithStore(browserHistory, store)

  const ua = navigator.userAgent;
  const muiTheme = getTheme(ua);

  render(
    <Provider store={store} >
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={history}>{createRoutes({store, first: { time: true }})}</Router>
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
  );

}

// Export it to render on the Golang server, keep the name sync with -
// https://github.com/olebedev/go-starter-kit/blob/master/server/react.go#L65
export const renderToString = toString;

require('../css');

// Style live reloading
if (module.hot) {
  let c = 0;
  module.hot.accept('../css', () => {
    require('../css');
    const a = document.createElement('a');
    const link = document.querySelector('link[rel="stylesheet"]');
    a.href = link.href;
    a.search = '?' + c++;
    link.href = a.href;
  });
}
