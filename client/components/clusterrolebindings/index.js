import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink, Link } from 'react-router';
import Toggle from 'react-toggle'
// Manually imported
// import '#localcss/react-toggle'

import { p, link } from '../homepage/styles';
import { clusterRoleBindings } from './styles';
import { fetchClusterRoleBindingsIfNeeded, invalidateClusterRoleBindings } from '#app/actions/clusterrolebindings';
import { setWide } from '#app/actions';
import { expectJSON, timeSince } from '#app/utils';

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
        <td key={clusterRoleBinding.metadata.uid + "name"}>{name}</td>,
        <td key={clusterRoleBinding.metadata.uid + "age"}>{age}</td>,
      ];
      if (wide) {
        const role = `${clusterRoleBinding.roleRef.kind}/${clusterRoleBinding.roleRef.name}`;
        const users = "...";
        const groups = "...";
        const serviceAccounts = "...";

        items = items.concat([
          <td key={clusterRoleBinding.metadata.uid + "role"}>{role}</td>,
          <td key={clusterRoleBinding.metadata.uid + "users"}>{users}</td>,
          <td key={clusterRoleBinding.metadata.uid + "groups"}>{groups}</td>,
          <td key={clusterRoleBinding.metadata.uid + "serviceAccounts"}>{serviceAccounts}</td>,
        ]);
      }
      return <tr key={clusterRoleBinding.metadata.uid}>
        {items}
      </tr>;
    });

    let tableHeaderItems = [
      <th key="1">Name</th>,
      <th key="2">Age</th>,
    ];
    if (wide) {
      tableHeaderItems = tableHeaderItems.concat([
        <th key="3">Role</th>,
        <th key="4">Users</th>,
        <th key="5">Groups</th>,
        <th key="6">Service Accounts</th>,
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
      <div className={p}>
        <table>
          <thead>
            <tr>
            {tableHeaderItems}
            </tr>
          </thead>
          <tbody>
          {clusterRoleBindingsItems}
          </tbody>
        </table>
      </div>
      <br />
      go <IndexLink to='/' className={link}>home</IndexLink>
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
