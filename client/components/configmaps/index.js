import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink, Link } from 'react-router';
import Toggle from 'react-toggle'
// Manually imported
// import '#localcss/react-toggle'

import { configmaps, p, link } from '../homepage/styles';
import NamespaceSelect from '#app/components/namespaces-select';
import { fetchNamespacesIfNeeded } from '#app/actions/namespaces';
import { fetchConfigMapsIfNeeded, invalidateConfigMaps } from '#app/actions/configmaps';
import { expectJSON, timeSince } from '#app/utils';

class ConfigMaps extends Component {

  constructor(props) {
    super(props);
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleSelectNamespace = this.handleSelectNamespace.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedNamespace } = this.props

    dispatch(fetchConfigMapsIfNeeded(selectedNamespace))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedNamespace } = this.props
    dispatch(invalidateConfigMaps())
    dispatch(fetchConfigMapsIfNeeded(selectedNamespace))
  }

  handleSelectNamespace(namespace) {
    const { dispatch, selectedNamespace } = this.props

    if (namespace != selectedNamespace) {
      dispatch(fetchConfigMapsIfNeeded(namespace))
    }
  }

  render() {
    const { items, isFetching, lastUpdated } = this.props;

    // See https://github.com/kubernetes/kubernetes/blob/5911f87dadb91a0670183ece1cefce9c24ff4251/pkg/printers/internalversion/printers.go#L1566
    const configmapsItems = items.map((configmap) => {
      const name = configmap.metadata.name;
      const data = configmap.data ? Object.keys(configmap.data).length : 0;
      const age = timeSince(new Date(configmap.metadata.creationTimestamp));

      let items = [
        <td key={configmap.metadata.uid + "name"}>{name}</td>,
        <td key={configmap.metadata.uid + "data"}>{data}</td>,
        <td key={configmap.metadata.uid + "age"}>{age}</td>,
      ];
      return <tr key={configmap.metadata.uid}>
        {items}
      </tr>;
    });

    let tableHeaderItems = [
      <th key="1">Name</th>,
      <th key="2">Data</th>,
      <th key="3">Age</th>,
    ];

    return <div className={configmaps}>
      <Helmet title='Kubernetes Config Maps' />
      <h2>Config Maps:</h2>
      <NamespaceSelect
        onChange={this.handleSelectNamespace}
      />
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
          {configmapsItems}
          </tbody>
        </table>
      </div>
      <br />
      go <IndexLink to='/' className={link}>home</IndexLink>
    </div>;
  }
}

function mapStateToProps(state) {
  const selectedNamespace = state.namespaces && state.namespaces.selectedNamespace || "default";
  const { configmaps } = state;
  const {
    isFetching,
    lastUpdated,
    items
  } = configmaps[selectedNamespace] || {
    isFetching: true,
    items: []
  }

  return {
    items,
    isFetching,
    lastUpdated,
    selectedNamespace
  }
}

export default connect(mapStateToProps)(ConfigMaps)
