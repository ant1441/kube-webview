import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import Toggle from 'react-toggle'
// Manually imported
// import '#localcss/react-toggle'

import ResourceTable from '#app/components/material/resource-table';

import { p, link } from '../homepage/styles';
import { componentStatus } from './styles';
import { fetchComponentStatusIfNeeded, invalidateComponentStatus } from '#app/actions/componentstatus';
import { expectJSON, timeSince } from '#app/utils';

class ComponentStatus extends Component {

  constructor(props) {
    super(props);
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props

    dispatch(fetchComponentStatusIfNeeded())
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch } = this.props
    dispatch(invalidateComponentStatus())
    dispatch(fetchComponentStatusIfNeeded())
  }

  render() {
    const { items, isFetching, lastUpdated } = this.props;

    const componentStatusItems = items.map((componentStatus) => {
      const name = componentStatus.metadata.name;
      const healthyCondition = componentStatus.conditions.find((cs) => cs.type === "Healthy") || "";
      const status = healthyCondition ? (healthyCondition.status == "True" ? "Healthy" : "Unhealthy") : "Unknown";
      const message = componentStatus.conditions.find((cs) => cs.type === "Healthy").message || "";
      const error = componentStatus.conditions.find((cs) => cs.type === "Healthy").error || "";

      let items = [
        {key: `${componentStatus.metadata.name}_name`, value: name},
        {key: `${componentStatus.metadata.name}_status`, value: status},
        {key: `${componentStatus.metadata.name}_message`, value: message},
        {key: `${componentStatus.metadata.name}_error`, value: error},
      ];
      return items;
    });

    let tableHeaderItems = [
      "Name",
      "Status",
      "Message",
      "Error",
    ];

    return <div className={componentStatus}>
      <Helmet title='Kubernetes Component Status' />
      <h2>Component Status:</h2>
      <Link onClick={this.handleRefreshClick}>
        <span>Refresh</span>
      </Link>
      <ResourceTable tableHeaderItems={tableHeaderItems} items={componentStatusItems} />
    </div>;
  }
}

function mapStateToProps(state) {
  const { componentStatus } = state;
  const isFetching = componentStatus.isFetching || false;
  const lastUpdated = componentStatus.lastUpdated;
  const items = componentStatus.items || [];

  return {
    items,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(ComponentStatus)
