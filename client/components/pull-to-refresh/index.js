import React, { Component } from 'react';
import Helmet from 'react-helmet';
import BodyStyle from 'body-style';
import { Paper } from 'material-ui';

import { refresher, hidden, visible, spinner, path } from './styles';


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
    if (!CSS.supports('overscroll-behavior-y', 'none')) {
      console.warn("Your browser doesn't support overscroll-behavior :(");
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
          this.handleRefresh(y);
      }
    }, {passive: true});
  }

  handleRefresh(y) {
    const { onRefresh } = this.props;
    this.setState({ refreshing: true, y: y })
    if (onRefresh) {
      onRefresh(event, () => {
        this.setState({ refreshing: false })
      });
    }
  }

  toggleRefresh(event) {
    const { refreshing } = this.state;
    this.setState({ refreshing: !refreshing })
  }

  render() {
    const { refreshing, y } = this.state;

    const bodyStyle = {
      "overscroll-behavior-y": "none",
    }
    const classNames = [refresher];
    if (refreshing) {
      classNames.push(visible);
      bodyStyle["pointer-events"] = "none";
    } else {
      classNames.push(hidden);
      bodyStyle["pointer-events"] = "auto";
    }

    return <div>
      <BodyStyle style={bodyStyle} />
      <div className={classNames.join(' ')}><Paper style={paperStyle} circle={true}><RefreshSpinner /></Paper></div>
    </div>;
  }
}

class RefreshSpinner extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return <svg className={spinner} width="55px" height="55px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
           <circle className={path} fill="none" strokeWidth="5" strokeLinecap="round" cx="33" cy="33" r="25"></circle>
           </svg>
  }
}
