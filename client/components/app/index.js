import React, { Component } from 'react';
import Helmet from 'react-helmet';

import MyAppBar from '#app/components/material/app-bar';
import NavDrawer from '#app/components/material/nav-drawer';

export default class App extends Component {

  render() {
    return <div>
      <Helmet title='Kubernetes Webview' />
      <MyAppBar />
      <NavDrawer />
      {this.props.children}
    </div>;
  }
}
