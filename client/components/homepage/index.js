import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { link } from './styles';

import { Divider, Paper } from 'material-ui';
import { List, ListItem } from 'material-ui/List';

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
      <Paper zDepth={1}>
        <List>
          <Link className={link} to='/nodes'><ListItem primaryText="Nodes" /></Link>
          <Link className={link} to='/namespaces'><ListItem primaryText="Namespaces" /></Link>
          <Link className={link} to='/pods'><ListItem primaryText="Pods" /></Link>
          <Link className={link} to='/services'><ListItem primaryText="Services" /></Link>
          <Link className={link} to='/ingress'><ListItem primaryText="Ingress" /></Link>
          <Link className={link} to='/configmaps'><ListItem primaryText="Config Maps" /></Link>
          <Link className={link} to='/clusterrolebindings'><ListItem primaryText="Cluster Role Bindings" /></Link>
          <Link className={link} to='/componentstatus'><ListItem primaryText="Component Status" /></Link>
        </List>
      </Paper>
    </div>;
  }

}
