import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink, Link } from 'react-router';
import Toggle from 'react-toggle'
// Manually imported
// import '#localcss/react-toggle'

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
      const healthyCondition = componentStatus.conditions.find((cs) => cs.type === "Healthy");
      const status = healthyCondition ? (healthyCondition.status == "True" ? "Healthy" : "Unhealthy") : "Unknown";
      const message = componentStatus.conditions.find((cs) => cs.type === "Healthy").message;
      const error = componentStatus.conditions.find((cs) => cs.type === "Healthy").error;

      let items = [
        <td key={componentStatus.metadata.uid + "name"}>{name}</td>,
        <td key={componentStatus.metadata.uid + "status"}>{status}</td>,
        <td key={componentStatus.metadata.uid + "message"}>{message}</td>,
        <td key={componentStatus.metadata.uid + "error"}>{error}</td>,
      ];
      return <tr key={componentStatus.metadata.uid}>
        {items}
      </tr>;
    });

    let tableHeaderItems = [
      <th key="1">Name</th>,
      <th key="2">Status</th>,
      <th key="3">Message</th>,
      <th key="4">Error</th>,
    ];

    return <div className={componentStatus}>
      <Helmet title='Kubernetes Component Status' />
      <h2>Component Status:</h2>
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
          {componentStatusItems}
          </tbody>
        </table>
      </div>
      <br />
      go <IndexLink to='/' className={link}>home</IndexLink>
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
