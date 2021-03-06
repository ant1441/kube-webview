import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';

import createRoutes from './routes';
import { createStore, setAsCurrentStore } from '../store';
import { createTheme, setAsCurrentTheme } from '../material';

/**
 * Handle HTTP request at Golang server
 *
 * @param   {Object}   options  request options
 * @param   {Function} cbk      response callback
 */
export default function (options, cbk) {
  cbk = global[cbk];
  let result = {
    uuid: options.uuid,
    app: null,
    title: null,
    meta: null,
    initial: null,
    error: null,
    redirect: null
  };

  const store = createStore();
  setAsCurrentStore(store);

  try {
    match({ routes: createRoutes({store, first: { time: false }}), location: options.url },
          (error, redirectLocation, renderProps) => {
      try {
        if (error) {
          result.error = error;

        } else if (redirectLocation) {
          result.redirect = redirectLocation.pathname + redirectLocation.search;

        } else {
          const ua = navigator.userAgent;
          const muiTheme = createTheme(ua);
          setAsCurrentTheme(muiTheme);

          result.app = renderToString(
            <Provider store={store}>
              <MuiThemeProvider muiTheme={muiTheme}>
                <RouterContext {...renderProps} />
              </MuiThemeProvider>
            </Provider>
          );
          const { title, meta } = Helmet.rewind();
          result.title = title.toString();
          result.meta = meta.toString();
          result.initial = JSON.stringify(store.getState());
          console.log("Initial state: %s", result.initial);
        }
      } catch (e) {
        result.error = e;
      }
      return cbk(result);
    });
  } catch (e) {
    result.error = e;
    return cbk(result);
  }
}
