import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { AppBar, FlatButton } from 'material-ui';

import { toggleNavDrawer } from '#app/actions/material';

import { title } from './styles';

class MyAppBar extends Component {
  constructor(props) {
    super(props);
    this.handleLeftButtonClick = this.handleLeftButtonClick.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  handleLeftButtonClick() {
    const { dispatch } = this.props

    dispatch(toggleNavDrawer())
  }

  handleRefresh() {
    const { dispatch } = this.props

    alert("TODO: refresh");
  }

  render() {
    return <AppBar
      title={<Link className={title} to='/'>Kubernetes Webview</Link>}
      onLeftIconButtonClick={this.handleLeftButtonClick}
      iconElementRight={<FlatButton label="Save" />}
    />;
  }
}

export default connect()(MyAppBar)
