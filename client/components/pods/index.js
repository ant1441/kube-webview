import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import Toggle from 'react-toggle'
// Manually imported
// import '#localcss/react-toggle'

import ResourceTable from '#app/components/material/resource-table';

import { pods, p, link } from '../homepage/styles';
import NamespaceSelect from '#app/components/namespaces-select';
import { fetchNamespacesIfNeeded } from '#app/actions/namespaces';
import { fetchPodsIfNeeded, invalidatePods } from '#app/actions/pods';
import { setWide } from '#app/actions';
import { expectJSON, timeSince } from '#app/utils';


const NodeUnreachablePodReason = "NodeLost";

class Pods extends Component {

  constructor(props) {
    super(props);
    this.handleWideChange = this.handleWideChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleSelectNamespace = this.handleSelectNamespace.bind(this);
    this.getPodStatus = this.getPodStatus.bind(this);
    this.podInitialising = this.podInitialising.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedNamespace } = this.props

    dispatch(setWide(false))
    dispatch(fetchPodsIfNeeded(selectedNamespace))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedNamespace } = this.props
    dispatch(invalidatePods())
    dispatch(fetchPodsIfNeeded(selectedNamespace))
  }

  handleSelectNamespace(namespace) {
    const { dispatch, selectedNamespace } = this.props

    if (namespace != selectedNamespace) {
      dispatch(fetchPodsIfNeeded(namespace))
    }
  }

  handleWideChange(event) {
    const checked = event.target.checked;
    const { dispatch } = this.props

    dispatch(setWide(checked))
  }

  podInitialising(pod) {
    if (!pod.status.initContainerStatuses){
        return false;
    }
    return pod.status.initContainerStatuses.every((ics) => ics.state.terminated && ics.state.terminated.exitCode == 0);
  }

  getPodStatus(pod) {
    var reason = pod.status.reason || pod.status.phase;
    for (var idx in pod.status.initContainerStatuses) {
        const ics = pod.status.initContainerStatuses[idx];
      if (ics.state.terminated && (ics.state.terminated.exitCode == 0)) {
        continue;
      } else if (ics.state.terminated) {
        // initialization is failed
        if (ics.state.terminated.reason.length == 0) {
          if (ics.state.terminated.signal) {
            reason = `Init:Signal:${ics.state.terminated.signal}`;
          } else {
            reason = `Init:ExitCode:${ics.state.terminated.exitCode}`;
          }
        } else {
          reason = `Init:${ics.State.Terminated.Reason}`;
        }
      } else if (ics.state.waiting && ics.state.waiting.reason.length > 0 && ics.state.waiting.reason != "PodInitializing") {
        reason = `Init:${ics.State.Waiting.Reason}`;
      } else {
        reason = `Init:${pod.status.initContainerStatuses.indexOf(ics)}/${pod.spec.initContainers.length}`;
      }
    }

    if (!this.podInitialising(pod)) {
      for (var idx in pod.status.containerStatuses) {
        const cs = pod.status.containerStatuses[idx];
        if (cs.state.waiting && cs.state.waiting.reason) {
          reason = cs.state.waiting.reason;
        } else if (cs.state.terminated && cs.state.terminated.reason) {
          reason = cs.state.terminated.reason;
        } else if (cs.state.terminated && !cs.state.terminated.reason) {
          if (cs.state.terminated.signal) {
            reason = `Signal:${cs.state.terminated.signal}`;
          } else {
            reason = `ExitCode:${cs.state.terminated.exitCode}`;
          }
        }
      }
    }

    if (pod.metadata.deletionTimestamp && pod.status.reason == NodeUnreachablePodReason) {
      return "Unknown";
    } else if (pod.metadata.deletionTimestamp) {
      return "Terminating";
    }

    return reason;
  }

  render() {
    const { items, isFetching, lastUpdated, wide } = this.props;

    // See https://github.com/kubernetes/kubernetes/blob/5911f87dadb91a0670183ece1cefce9c24ff4251/pkg/printers/internalversion/printers.go#L523
    const podsItems = items.map((pod) => {
      const name = pod.metadata.name;
      const readyContainers = pod.status.containerStatuses && pod.status.containerStatuses.reduce((acc, cs) => {
          return acc + ((cs.ready && cs.state.running) ? 1 : 0);
      }, 0);
      const totalContainers = pod.spec.containers.length;
      const ready = `${readyContainers}/${totalContainers}`;
      const status = this.getPodStatus(pod);
      const initRestarts = pod.status.initContainerStatuses && pod.status.initContainerStatuses.reduce((acc, cs) => acc + cs.restartCount, 0);
      const containerRestarts = pod.status.containerStatuses && pod.status.containerStatuses.reduce((acc, cs) => acc + cs.restartCount, 0);

      const restarts = this.podInitialising(pod) ? initRestarts : containerRestarts;
      const age = timeSince(new Date(pod.metadata.creationTimestamp));

      let items = [
        {key: pod.metadata.uid + "name", value: name},
        {key: pod.metadata.uid + "ready", value: ready},
        {key: pod.metadata.uid + "status", value: status},
        {key: pod.metadata.uid + "restarts", value: restarts},
        {key: pod.metadata.uid + "age", value: age},
      ];
      if (wide) {
        const ip = pod.status.podIP;
        const node = pod.spec.nodeName;

        items = items.concat([
          {key: pod.metadata.uid + "ip", value: ip},
          {key: pod.metadata.uid + "node", value: node},
        ]);
      }
      return items;
    });

    let tableHeaderItems = [
      "Name",
      "Ready",
      "Status",
      "Restarts",
      "Age",
    ];
    if (wide) {
      tableHeaderItems = tableHeaderItems.concat([
        "IP",
        "Node",
      ]);
    }

    return <div className={pods}>
      <Helmet title='Kubernetes Pods' />
      <h2>Pods:</h2>
      <label>
        <Toggle
          defaultChecked={wide}
          icons={false}
          onChange={this.handleWideChange} />
        <span>Wide</span>
      </label>
      <NamespaceSelect
        onChange={this.handleSelectNamespace}
      />
      <Link onClick={this.handleRefreshClick}>
        <span>Refresh</span>
      </Link>
      <ResourceTable tableHeaderItems={tableHeaderItems} items={podsItems} />
    </div>;
  }
}

function mapStateToProps(state) {
  const selectedNamespace = state.namespaces && state.namespaces.selectedNamespace || "default";
  const wide = state.config && state.config.wide
  const { pods } = state;
  const {
    isFetching,
    lastUpdated,
    items
  } = pods[selectedNamespace] || {
    isFetching: true,
    items: []
  }

  return {
    items,
    isFetching,
    lastUpdated,
    wide,
    selectedNamespace
  }
}

export default connect(mapStateToProps)(Pods)
