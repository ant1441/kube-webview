import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import { toggleNavDrawer, setNavDrawer } from '#app/actions/material';

class NavDrawer extends Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleToggle() {
    const { dispatch } = this.props

    dispatch(toggleNavDrawer())
  }

  handleClose() {
    const { dispatch } = this.props

    dispatch(setNavDrawer(false))
  }

  handleClick(path) {
    const { dispatch } = this.props

    return function() {
      dispatch(setNavDrawer(false))
      dispatch(push(path))
    }
  }

  render() {
    const { open } = this.props;

    return (
      <Drawer
        docked={false}
        width={200}
        open={open}
        onRequestChange={this.handleToggle}
      >
        {links.map((link, i) => (
          <MenuItem key={i} onClick={this.handleClick(link.path)}>{link.name}</MenuItem>
        ))}
      </Drawer>
    );
  }
}

const links = [
  {path: "/nodes", name: "Nodes"},
  {path: "/namespaces", name: "Namespaces"},
  {path: "/pods", name: "Pods"},
  {path: "/services", name: "Services"},
  {path: "/ingress", name: "Ingress"},
  {path: "/configmaps", name: "Config Maps"},
  {path: "/clusterrolebindings", name: "Cluster Role Bindings"},
  {path: "/componentstatus", name: "Component Status"},
];

function mapStateToProps(state) {
  const { navDrawer } = state.material;
  const open = !!navDrawer.open;

  return {
    open
  }
}

export default connect(mapStateToProps)(NavDrawer)
