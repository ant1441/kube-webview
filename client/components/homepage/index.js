import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { title, p, link } from './styles';

export default class Homepage extends Component {
  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    // Load here any data.
    callback(); // this call is important, don't forget it
  }
  /*eslint-enable */

  render() {
    return <div>
      <Helmet
        title='Kubernetes Webview'
        meta={[
          {
            property: 'og:title',
            content: 'Webview for Kubernetes'
          }
        ]} />
      <h1 className={title}>
      Kubernetes Webview
      </h1>
      <ul>
        <li><Link className={link} to='/nodes'>Nodes</Link></li>
        <li><Link className={link} to='/namespaces'>Namespaces</Link></li>
        <li><Link className={link} to='/pods'>Pods</Link></li>
        <li><Link className={link} to='/services'>Services</Link></li>
        <li><Link className={link} to='/ingress'>Ingress</Link></li>
        <li><Link className={link} to='/configmaps'>Config Maps</Link></li>
        <li><Link className={link} to='/clusterrolebindings'>Cluster Role Bindings</Link></li>
      </ul>

      <br />
      <p className={p}>
        Please take a look at <Link className={link} to='/docs'>usage</Link> page.
      </p>
    </div>;
  }

}
