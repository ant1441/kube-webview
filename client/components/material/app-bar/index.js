import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { AppBar } from 'material-ui';

import { toggleNavDrawer } from '#app/actions/material';

import { title } from './styles';

class MyAppBar extends Component {
  constructor(props) {
    super(props);
    this.handleLeftButtonClick = this.handleLeftButtonClick.bind(this);
  }

  handleLeftButtonClick() {
    const { dispatch } = this.props

    dispatch(toggleNavDrawer())
  }

  render() {
    return <AppBar
      title={<Link className={title} to='/'>Kubernetes Webview</Link>}
      iconClassNameRight="muidocs-icon-navigation-expand-more"
      onLeftIconButtonClick={this.handleLeftButtonClick}
    />;
  }
}

export default connect()(MyAppBar)
