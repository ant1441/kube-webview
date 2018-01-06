import React, { Component } from 'react';
import Helmet from 'react-helmet';

export default class App extends Component {

  render() {
    return <div>
      <Helmet title='Kubernetes Webview' />
      {this.props.children}
    </div>;
  }

}
