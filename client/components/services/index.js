import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { Toggle } from 'material-ui';

import ResourceTable from '#app/components/material/resource-table';

import { p, link } from '../homepage/styles';
import { services } from './styles';
import NamespaceSelect from '#app/components/material/namespaces-select';
import { fetchNamespacesIfNeeded } from '#app/actions/namespaces';
import { fetchServicesIfNeeded, invalidateServices } from '#app/actions/services';
import { setWide } from '#app/actions';
import { expectJSON, timeSince } from '#app/utils';

class Services extends Component {

  constructor(props) {
    super(props);
    this.handleWideChange = this.handleWideChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleSelectNamespace = this.handleSelectNamespace.bind(this);
    this.getServiceExternalIP = this.getServiceExternalIP.bind(this);
    this.makePortString = this.makePortString.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedNamespace } = this.props

    dispatch(setWide(false))
    dispatch(fetchServicesIfNeeded(selectedNamespace))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedNamespace } = this.props
    dispatch(invalidateServices())
    dispatch(fetchServicesIfNeeded(selectedNamespace))
  }

  handleSelectNamespace(namespace) {
    const { dispatch, selectedNamespace } = this.props

    if (namespace != selectedNamespace) {
      dispatch(fetchServicesIfNeeded(namespace))
    }
  }

  handleWideChange(event) {
    const checked = event.target.checked;
    const { dispatch } = this.props

    dispatch(setWide(checked))
  }

  getServiceExternalIP(service) {
      const { wide } = this.props;
      switch (service.spec.type) {
          case 'ClusterIP':
          case 'NodePort':
            if (service.spec.externalIPs && service.spec.externalIPs.length) {
              return service.spec.externalIPs.join(', ');
            }
            break;
          case 'LoadBalancer':
            const lb = service.status.loadBalancer;
            let lbIps = lb.ingress.map((i) => {
                if (i.ip) {
                    return i.ip;
                } else if (i.hostname) {
                    return i.hostname;
                }
            }).join(', ');
            if (!wide) {
                lbIps = lbIps.substring(0, 13) + "...";
            }

            if (service.spec.externalIPs.length) {
                return [lbIps, service.spec.externalIPs].join(', ');
            }
            if (lbIps) {
                return lbIps;
            }
            return "<pending>";
          case 'ExternalName':
            return service.spec.externalName;
          default:
            return "<unknown>"
      }
      return "<none>"
  }

  makePortString(service) {
    const ports = service.spec.ports;

    return ports.map((p) => p.nodePort ? `${p.port}:${p.nodePort}/${p.protocol}` : `${p.port}/${p.protocol}`).join(', ');
  }

  render() {
    const { items, isFetching, lastUpdated, wide } = this.props;

    // See https://github.com/kubernetes/kubernetes/blob/5911f87dadb91a0670183ece1cefce9c24ff4251/pkg/printers/internalversion/printers.go#L858
    const servicesItems = items.map((service) => {
      const name = service.metadata.name;
      const type = service.spec.type;
      const clusterIP = service.spec.clusterIP;
      const externalIP = this.getServiceExternalIP(service);
      const ports = this.makePortString(service);
      const age = timeSince(new Date(service.metadata.creationTimestamp));

      let items = [
        {key: service.metadata.uid + "name", value: name},
        {key: service.metadata.uid + "type", value: type},
        {key: service.metadata.uid + "cluster-ip", value: clusterIP},
        {key: service.metadata.uid + "external-ip", value: externalIP},
        {key: service.metadata.uid + "ports", value: ports},
        {key: service.metadata.uid + "age", value: age},
      ];
      if (wide) {
        const selector = service.spec.selector ? Object.entries(service.spec.selector).map((e) => `${e[0]}=${e[1]}`).join(', ') : "<none>";

        items = items.concat([
          {key: service.metadata.uid + "selector", value: selector},
        ]);
      }
      return items;
    });

    let tableHeaderItems = [
      "Name",
      "Type",
      "Cluster IP",
      "External IP",
      "Port(s)",
      "Age",
    ];
    if (wide) {
      tableHeaderItems = tableHeaderItems.concat([
        "Selector",
      ]);
    }

    return <div className={services}>
      <Helmet title='Kubernetes Services' />
      <h2>Services:</h2>
      <Toggle
        label="Wide"
        toggled={wide}
        onToggle={this.handleWideChange}
        />
      <NamespaceSelect
        onChange={this.handleSelectNamespace}
      />
      <Link onClick={this.handleRefreshClick}>
        <span>Refresh</span>
      </Link>
      <ResourceTable tableHeaderItems={tableHeaderItems} items={servicesItems} />
    </div>;
  }
}

function mapStateToProps(state) {
  const selectedNamespace = state.namespaces && state.namespaces.selectedNamespace || "default";
  const wide = state.config && state.config.wide
  const { services } = state;
  const {
    isFetching,
    lastUpdated,
    items
  } = services[selectedNamespace] || {
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

export default connect(mapStateToProps)(Services)
