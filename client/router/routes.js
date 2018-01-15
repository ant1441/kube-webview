import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import DevTools from '#app/components/dev-tools';
import App from '#app/components/app';
import Homepage from '#app/components/homepage';
import Usage from '#app/components/usage';
import NotFound from '#app/components/not-found';
import Nodes from '#app/components/nodes';
import Namespaces from '#app/components/namespaces';
import Pods from '#app/components/pods';
import Services from '#app/components/services';
import Ingress from '#app/components/ingress';
import ConfigMaps from '#app/components/configmaps';
import ClusterRoleBindings from '#app/components/clusterrolebindings';

/**
 * Returns configured routes for different
 * environments. `w` - wrapper that helps skip
 * data fetching with onEnter hook at first time.
 * @param {Object} - any data for static loaders and first-time-loading marker
 * @returns {Object} - configured routes
 */
export default ({store, first}) => {

  // Make a closure to skip first request
  function w(loader) {
    return (nextState, replaceState, callback) => {
      if (first.time) {
        first.time = false;
        return callback();
      }
      return loader ? loader({store, nextState, replaceState, callback}) : callback();
    };
  }

  return (
    <div>
      <DevTools />
      <Route path="/" component={App}>
        <IndexRoute component={Homepage} onEnter={w(Homepage.onEnter)}/>
        <Route path="/nodes" component={Nodes} onEnter={w(Nodes.onEnter)}/>
        <Route path="/namespaces" component={Namespaces} onEnter={w(Namespaces.onEnter)}/>
        <Route path="/pods" component={Pods} onEnter={w(Pods.onEnter)}/>
        <Route path="/services" component={Services} onEnter={w(Services.onEnter)}/>
        <Route path="/ingress" component={Ingress} onEnter={w(Ingress.onEnter)}/>
        <Route path="/configmaps" component={ConfigMaps} onEnter={w(ConfigMaps.onEnter)}/>
        <Route path="/clusterrolebindings" component={ClusterRoleBindings} onEnter={w(ClusterRoleBindings.onEnter)}/>
        <Route path="/usage" component={Usage} onEnter={w(Usage.onEnter)}/>
        {/* Server redirect in action */}
        <Redirect from="/docs" to="/usage" />
        <Route path="*" component={NotFound} onEnter={w(NotFound.onEnter)}/>
      </Route>
    </div>
  );
};
