import React, { Component } from 'react';
import { Dialog, FlatButton } from 'material-ui';

export default class FetchError extends Component {

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleRetryClick = this.handleRetryClick.bind(this)
  }

  componentDidMount() {
      const { name, error } = this.props;
      if (error) {
          console.error("Fetch error with %s: %o", name, error);
      }
  }

  handleRetryClick(e) {
    e.preventDefault()

    const { handleRetryClick } = this.props
    if (handleRetryClick) {
      handleRetryClick(e)
    }
  }

  handleClose(e) {
    e.preventDefault()

    const { handleClose } = this.props
    if (handleClose) {
      handleClose(e)
    }
  }

  render() {
    const { name, error } = this.props;
    const open = error ? true : false;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Retry"
        primary={true}
        onClick={this.handleRetryClick}
      />,
    ];

    return <Dialog
            title={`Error fetching ${name}`}
            open={open}
            actions={actions}>
              <p>
                There was an error when fetching {name}:
                <br />
                {(error || "").toString()}
              </p>
            </Dialog>;
  }
}
