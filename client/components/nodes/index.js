import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink, Link } from 'react-router';
import Toggle from 'react-toggle'
// Manually imported
// import '#localcss/react-toggle'

import { nodes, p, link } from '../homepage/styles';
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
        <td key={node.metadata.uid + "name"}>{name}</td>,
        <td key={node.metadata.uid + "status"}>{status}</td>,
        <td key={node.metadata.uid + "roles"}>{roles.join(", ")}</td>,
        <td key={node.metadata.uid + "age"}>{age}</td>,
        <td key={node.metadata.uid + "version"}>{version}</td>,
      ];
      if (wide) {
        const externalIP = node.status.nodeInfo.externalIP || "None";
        const osImage = node.status.nodeInfo.osImage;
        const kernelVersion = node.status.nodeInfo.kernelVersion;
        const containerRuntime = node.status.nodeInfo.containerRuntimeVersion;

        items = items.concat([
          <td key={node.metadata.uid + "external-ip"}>{externalIP}</td>,
          <td key={node.metadata.uid + "os-image"}>{osImage}</td>,
          <td key={node.metadata.uid + "kernel-version"}>{kernelVersion}</td>,
          <td key={node.metadata.uid + "container-runtime"}>{containerRuntime}</td>,
        ]);
      }
      return <tr key={node.metadata.uid}>
        {items}
      </tr>;
    });

    let tableHeaderItems = [
      <th key="1">Name</th>,
      <th key="2">Status</th>,
      <th key="3">Roles</th>,
      <th key="4">Age</th>,
      <th key="5">Version</th>,
    ];
    if (wide) {
      tableHeaderItems = tableHeaderItems.concat([
        <th key="6">External IP</th>,
        <th key="7">OS Image</th>,
        <th key="8">Kernel Version</th>,
        <th key="9">Container Runtime</th>,
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
      <div className={p}>
        <table>
          <thead>
            <tr>
            {tableHeaderItems}
            </tr>
          </thead>
          <tbody>
          {nodesItems}
          </tbody>
        </table>
      </div>
      <br />
      go <IndexLink to='/' className={link}>home</IndexLink>
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
