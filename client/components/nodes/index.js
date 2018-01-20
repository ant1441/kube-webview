import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import Toggle from 'react-toggle'
// Manually imported
// import '#localcss/react-toggle'

import ResourceTable from '#app/components/material/resource-table';

import { p, link } from '../homepage/styles';
import { nodes } from './styles';
import { fetchNodesIfNeeded, invalidateNodes } from '#app/actions/nodes';
import { setWide } from '#app/actions';
import { expectJSON, timeSince } from '#app/utils';


const LABEL_NODE_ROLE_MASTER = "node-role.kubernetes.io/master";

class Nodes extends Component {

  constructor(props) {
    super(props);
    this.handleWideChange = this.handleWideChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props

    dispatch(setWide(false))
    dispatch(fetchNodesIfNeeded())
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch } = this.props
    dispatch(invalidateNodes())
    dispatch(fetchNodesIfNeeded())
  }

  handleWideChange(event) {
    const checked = event.target.checked;
    const { dispatch } = this.props

    dispatch(setWide(checked))
  }

  render() {
    const { items, isFetching, lastUpdated, wide } = this.props;

    const nodesItems = items.map((node) => {
      const name = node.metadata.name;
      const status = node.status.conditions.filter((c) => c.status === "True").map((c) => c.type).join(', ');
      const isMaster = Object.keys(node.metadata.labels).includes(LABEL_NODE_ROLE_MASTER);
      const roles = [];
      if (isMaster) {
        roles.push("Master");
      }
      const age = timeSince(new Date(node.metadata.creationTimestamp));
      const version = node.status.nodeInfo.kubeletVersion;

      let items = [
        {key: `${node.metadata.uid}_name`, value: name},
        {key: `${node.metadata.uid}_status`, value: status},
        {key: `${node.metadata.uid}_roles`, value: roles.join(", ")},
        {key: `${node.metadata.uid}_age`, value: age},
        {key: `${node.metadata.uid}_version`, value: version},
      ];
      if (wide) {
        const externalIP = node.status.nodeInfo.externalIP || "None";
        const osImage = node.status.nodeInfo.osImage;
        const kernelVersion = node.status.nodeInfo.kernelVersion;
        const containerRuntime = node.status.nodeInfo.containerRuntimeVersion;

        items = items.concat([
          {key: `${node.metadata.uid}_external-ip`, value: externalIP},
          {key: `${node.metadata.uid}_os-image`, value: osImage},
          {key: `${node.metadata.uid}_kernel-version`, value: kernelVersion},
          {key: `${node.metadata.uid}_container-runtime`, value: containerRuntime},
        ]);
      }
      return items;
    });

    let tableHeaderItems = [
      "Name",
      "Status",
      "Roles",
      "Age",
      "Version",
    ];
    if (wide) {
      tableHeaderItems = tableHeaderItems.concat([
        "External IP",
        "OS Image",
        "Kernel Version",
        "Container Runtime",
      ]);
    }

    return <div className={nodes}>
      <Helmet title='Kubernetes Nodes' />
      <h2>Nodes:</h2>
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
      <ResourceTable tableHeaderItems={tableHeaderItems} items={nodesItems} />
    </div>;
  }
}

function mapStateToProps(state) {
  const { nodes } = state;
  const isFetching = nodes.isFetching || false;
  const lastUpdated = nodes.lastUpdated;
  const items = nodes.items || [];
  const wide = state.config && state.config.wide

  return {
    items,
    isFetching,
    lastUpdated,
    wide
  }
}

export default connect(mapStateToProps)(Nodes)
