import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

import ResourceTable from '#app/components/material/resource-table';

import { namespaces, p, link } from '../homepage/styles';
import { fetchNamespacesIfNeeded, invalidateNamespaces } from '#app/actions/namespaces';
import { setWide } from '#app/actions';
import { expectJSON, timeSince } from '#app/utils';


class Namespaces extends Component {

  constructor(props) {
    super(props);
    this.handleWideChange = this.handleWideChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props

    dispatch(setWide(false))
    dispatch(fetchNamespacesIfNeeded())
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch } = this.props
    dispatch(invalidateNamespaces())
    dispatch(fetchNamespacesIfNeeded())
  }

  handleWideChange(event) {
    const checked = event.target.checked;
    const { dispatch } = this.props

    dispatch(setWide(checked))
  }

  render() {
    const { items, isFetching, lastUpdated } = this.props;

    const namespacesItems = items.map((namespace) => {
      const name = namespace.metadata.name;
      const status = namespace.status.phase;
      const age = timeSince(new Date(namespace.metadata.creationTimestamp));

      const items = [
        {key: namespace.metadata.uid + "name", value: name},
        {key: namespace.metadata.uid + "status", value: status},
        {key: namespace.metadata.uid + "age", value: age},
      ];
      return items;
    });

    let tableHeaderItems = [
      "Name",
      "Status",
      "Age",
    ];

    return <div className={namespaces}>
      <Helmet title='Kubernetes Namespaces' />
      <h2>Namespaces:</h2>
      <Link onClick={this.handleRefreshClick}>
        <span>Refresh</span>
      </Link>
      <ResourceTable tableHeaderItems={tableHeaderItems} items={namespacesItems} />
    </div>;
  }
}

function mapStateToProps(state) {
  const { namespaces } = state;
  const isFetching = namespaces.isFetching || false;
  const lastUpdated = namespaces.lastUpdated;
  const items = namespaces.items || [];

  return {
    items,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(Namespaces)
