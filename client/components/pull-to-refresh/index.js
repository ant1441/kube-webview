import React, { Component } from 'react';
import Helmet from 'react-helmet';
import BodyStyle from 'body-style';
import { Paper } from 'material-ui';

import { refresher, hidden, visible, refreshSpinner, demoButton } from './styles';


const paperStyle = {
  height: 55,
  width: 55,
  margin: 5,
  textAlign: 'center',
  display: 'inline-block',
};


export default class PullToRefresh extends Component {

  constructor(props) {
    super(props);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.toggleRefresh = this.toggleRefresh.bind(this);

    this.state = {
      refreshing: false, // TODO
    }
  }

  componentDidMount() {
    if (!CSS.supports('overscroll-behavior-y', 'contain')) {
      console.log("Your browser doesn't support overscroll-behavior :(");
      return;
    }

    let _startY;
    const app = document.querySelector('#app');

    app.addEventListener('touchstart', e => {
      _startY = e.touches[0].pageY;
    }, {passive: true});

    app.addEventListener('touchmove', e => {
      const y = e.touches[0].pageY;
      // Activate custom pull-to-refresh effects when at the top of the container
      // and user is scrolling up.
      if (document.scrollingElement.scrollTop === 0 && y > _startY &&
          !document.body.classList.contains('refreshing')) {
          this.handleRefresh();
      }
    }, {passive: true});
  }

  handleRefresh(event) {
    const { onRefresh } = this.props;
    console.log("REFRESHING");
    this.setState({ refreshing: true })
    if (onRefresh) {
        onRefresh(event);
    }
  }

  toggleRefresh(event) {
    const { refreshing } = this.state;
    this.setState({ refreshing: !refreshing })
  }

  render() {
    const { refreshing } = this.state;
    console.log("REFRESHING: %o", refreshing);

    const bodyStyle = {
      "overscroll-behavior-y": "contain", /* disable pull to refresh, keeps glow effects */
    }
    const classNames = [refresher];
    if (refreshing) {
      classNames.push(visible);
    } else {
      classNames.push(hidden);
    }

    return <div>
      <BodyStyle style={bodyStyle} />
      <div className={classNames.join(' ')}><Paper style={paperStyle} circle={true}><div className={refreshSpinner} /></Paper></div>
      <a onClick={this.toggleRefresh} className={demoButton}>CLICK ME</a>
    </div>;
  }
}
