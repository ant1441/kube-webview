import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import Toggle from 'react-toggle'
// Manually imported
// import '#localcss/react-toggle'

import ResourceTable from '#app/components/material/resource-table';

import { p, link } from '../homepage/styles';
import { clusterRoleBindings } from './styles';
import { fetchClusterRoleBindingsIfNeeded, invalidateClusterRoleBindings } from '#app/actions/clusterrolebindings';
import { setWide } from '#app/actions';
import { expectJSON, timeSince } from '#app/utils';

const GroupKind = "Group";
const ServiceAccountKind = "ServiceAccount";
const UserKind = "User";

class ClusterRoleBindings extends Component {

  constructor(props) {
    super(props);
    this.handleWideChange = this.handleWideChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props

    dispatch(setWide(false))
    dispatch(fetchClusterRoleBindingsIfNeeded())
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch } = this.props
    dispatch(invalidateClusterRoleBindings())
    dispatch(fetchClusterRoleBindingsIfNeeded())
  }

  handleWideChange(event) {
    const checked = event.target.checked;
    const { dispatch } = this.props

    dispatch(setWide(checked))
  }

  render() {
    const { items, isFetching, lastUpdated, wide } = this.props;

    const clusterRoleBindingsItems = items.map((clusterRoleBinding) => {
      const name = clusterRoleBinding.metadata.name;
      const age = timeSince(new Date(clusterRoleBinding.metadata.creationTimestamp));

      let items = [
        {key: clusterRoleBinding.metadata.uid + "name", value: name},
        {key: clusterRoleBinding.metadata.uid + "age", value: age},
      ];
      if (wide) {
        const role = `${clusterRoleBinding.roleRef.kind}/${clusterRoleBinding.roleRef.name}`;

        const subjects = clusterRoleBinding.subjects || [];
        const users = subjects.filter((s) => s.kind == UserKind).map((s) => s.name).join(', ');
        const groups = subjects.filter((s) => s.kind == GroupKind).map((s) => s.name).join(', ');
        const serviceAccounts = subjects.filter((s) => s.kind == ServiceAccountKind).map((s) => `${s.namespace}/${s.name}`).join(', ');

        items = items.concat([
          {key: clusterRoleBinding.metadata.uid + "role", value: role},
          {key: clusterRoleBinding.metadata.uid + "users", value: users},
          {key: clusterRoleBinding.metadata.uid + "groups", value: groups},
          {key: clusterRoleBinding.metadata.uid + "serviceAccounts", value: serviceAccounts},
        ]);
      }
      return items;
    });

    let tableHeaderItems = [
      "Name",
      "Age",
    ];
    if (wide) {
      tableHeaderItems = tableHeaderItems.concat([
        "Role",
        "Users",
        "Groups",
        "Service Accounts",
      ]);
    }

    return <div className={clusterRoleBindings}>
      <Helmet title='Kubernetes Cluster Role Bindings' />
      <h2>Cluster Role Bindings:</h2>
      <label>
        <Toggle
          defaultChecked={wide}
          icons={false}
          onChange={this.handleWideChange} />
        <span>Wide</span>
      </label>
      <Link onClick={this.handleRefreshClick}>
        <span>Refresh</span>
      </Link>
      <ResourceTable tableHeaderItems={tableHeaderItems} items={clusterRoleBindingsItems} />
    </div>;
  }
}

function mapStateToProps(state) {
  const { clusterrolebindings } = state;
  const isFetching = clusterrolebindings.isFetching || false;
  const lastUpdated = clusterrolebindings.lastUpdated;
  const items = clusterrolebindings.items || [];
  const wide = state.config && state.config.wide

  return {
    items,
    isFetching,
    lastUpdated,
    wide
  }
}

export default connect(mapStateToProps)(ClusterRoleBindings)
