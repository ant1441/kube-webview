import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink, Link } from 'react-router';
import Toggle from 'react-toggle'
// Manually imported
// import '#localcss/react-toggle'

import { p, link } from '../homepage/styles';
import { ingress } from './styles';
import NamespaceSelect from '#app/components/namespaces-select';
import { fetchNamespacesIfNeeded } from '#app/actions/namespaces';
import { fetchIngressIfNeeded, invalidateIngress } from '#app/actions/ingress';
import { setWide } from '#app/actions';
import { expectJSON, timeSince } from '#app/utils';

class Ingress extends Component {

  constructor(props) {
    super(props);
    this.handleWideChange = this.handleWideChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleSelectNamespace = this.handleSelectNamespace.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedNamespace } = this.props

    dispatch(setWide(false))
    dispatch(fetchIngressIfNeeded(selectedNamespace))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedNamespace } = this.props
    dispatch(invalidateIngress())
    dispatch(fetchIngressIfNeeded(selectedNamespace))
  }

  handleSelectNamespace(namespace) {
    const { dispatch, selectedNamespace } = this.props

    if (namespace != selectedNamespace) {
      dispatch(fetchIngressIfNeeded(namespace))
    }
  }

  handleWideChange(event) {
    const checked = event.target.checked;
    const { dispatch } = this.props

    dispatch(setWide(checked))
  }

  render() {
    const { items, isFetching, lastUpdated, wide } = this.props;

    // See https://github.com/kubernetes/kubernetes/blob/5911f87dadb91a0670183ece1cefce9c24ff4251/pkg/printers/internalversion/printers.go#L930
    const ingressItems = items.map((service) => {
      const name = service.metadata.name;
      const hosts = service.spec.rules ? service.spec.rules.map((r) => r.host).join(', ') : "*";

      const lb = service.status.loadBalancer;
      let address = lb.ingress.map((i) => {
        if (i.ip) {
          return i.ip;
        } else if (i.hostname) {
          return i.hostname;
        }
      }).join(', ');
      if (!wide && address) {
        address = address.substring(0, 13) + "...";
      }
      const ports = service.spec.tls ? "80, 443" : "80";
      const age = timeSince(new Date(service.metadata.creationTimestamp));

      let items = [
        <td key={service.metadata.uid + "name"}>{name}</td>,
        <td key={service.metadata.uid + "hosts"}>{hosts}</td>,
        <td key={service.metadata.uid + "address"}>{address}</td>,
        <td key={service.metadata.uid + "ports"}>{ports}</td>,
        <td key={service.metadata.uid + "age"}>{age}</td>,
      ];
      return <tr key={service.metadata.uid}>
        {items}
      </tr>;
    });

    let tableHeaderItems = [
      <th key="1">Name</th>,
      <th key="2">Hosts</th>,
      <th key="3">Address</th>,
      <th key="4">Port(s)</th>,
      <th key="5">Age</th>,
    ];

    return <div className={ingress}>
      <Helmet title='Kubernetes Ingress' />
      <h2>Ingress:</h2>
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
      <div className={p}>
        <table>
          <thead>
            <tr>
            {tableHeaderItems}
            </tr>
          </thead>
          <tbody>
          {ingressItems}
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
  const wide = state.config && state.config.wide
  const { ingress } = state;
  const {
    isFetching,
    lastUpdated,
    items
  } = ingress[selectedNamespace] || {
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

export default connect(mapStateToProps)(Ingress)
