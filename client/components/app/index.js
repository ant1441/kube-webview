import React, { Component } from 'react';
import Helmet from 'react-helmet';
import BodyStyle from 'body-style';
import { muiThemeable } from 'material-ui/styles';

import MyAppBar from '#app/components/material/app-bar';
import NavDrawer from '#app/components/material/nav-drawer';
import PullToRefresh from '#app/components/pull-to-refresh';


const styles = theme => ({
  '@global': {
    html: {
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
      // Change from `box-sizing: content-box` so that `width`
      // is not affected by `padding` or `border`.
      boxSizing: 'border-box',
    },
    '*, *::before, *::after': {
      boxSizing: 'inherit',
    },
    body: {
      margin: 0, // Remove the margin in all browsers.
      backgroundColor: theme.palette.background.default,
      '@media print': {
        // Save printer ink.
        backgroundColor: theme.palette.common.white,
      },
    },
  },
});

class App extends Component {
  render() {
    const theme = this.props.muiTheme;
    const bodyStyle = {
      backgroundColor: theme.baseTheme.palette.accent2Color,
    }

    return <div>
      <Helmet title='Kubernetes Webview' />
      <BodyStyle style={bodyStyle} />

      <PullToRefresh />
      <MyAppBar />
      <NavDrawer />
      {this.props.children}
    </div>;
  }
}

export default muiThemeable()(App);
