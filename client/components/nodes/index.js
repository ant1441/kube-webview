import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink } from 'react-router';
import Toggle from 'react-toggle'
import '#css/local/react-toggle'

import { todo } from './styles';
import { nodes, p, link } from '../homepage/styles';
import { setNodes } from '../../actions';
import { expectJSON, timeSince } from '../utils';

class Nodes extends Component {

  constructor(props) {
    super(props);
    this.state = {wide: false};
  }

  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    fetch('/api/v1/nodes')
      .then(expectJSON)
      .then((nodes) => {
        store.dispatch(setNodes(nodes));
        callback();
      }).catch((e) => {
          console.log("Error fetching nodes", e);
          callback();
      });
  }
  /*eslint-enable */

  render() {
    let nodes = this.props.nodes;
    var nodesItems;
    let wide = window.location

    if (nodes && nodes.items) {
      nodesItems = nodes.items.map((node) => {
        let name = node.metadata.name;
        let status = node.status.conditions.filter((c) => c.status === "True").map((c) => c.type).join(', ');
        let roles = "...";
        let age = timeSince(new Date(node.metadata.creationTimestamp));
        let version = node.status.nodeInfo.kubeletVersion;
        return <tr key={node.metadata.uid}>
            <td>{name}</td>
            <td>{status}</td>
            <td>{roles}</td>
            <td>{age}</td>
            <td>{version}</td>
         </tr>;
      });
    } else {
      console.log("no node.items");
      nodesItems = "";
    }
    console.log("nodeItems: %s", nodesItems);

    return <div className={nodes}>
      <Helmet title='Kubernetes Nodes' />
      <h2>Nodes:</h2>
      <label>
        <Toggle
          defaultChecked={this.state.wide}
          icons={false}
          onChange={this.handleTofuChange} />
        <span>Wide</span>
      </label>
      <div className={p}>
        <table>
          <thead>
            <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Roles</th>
            <th>Age</th>
            <th>Version</th>
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

export default connect(store => ({ nodes: store.nodes }))(Nodes);
