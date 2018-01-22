import React, { Component } from 'react';
import { connect } from 'react-redux';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import { fetchNamespacesIfNeeded, setSelectedNamespace } from '#app/actions/namespaces';

class NamespaceSelect extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props

    dispatch(fetchNamespacesIfNeeded())
  }

  handleSelect(event, index, value) {
    const { dispatch, onChange } = this.props

    dispatch(setSelectedNamespace(value))
    if (onChange) {
        // Notify the parent element
        onChange(value);
    }
  }

  render() {
    const { items, selectedNamespace, isFetching, lastUpdated, wide } = this.props;

    const options = items.map((namespace) => {
      const name = namespace.metadata.name;
      return { value: name, label: name };
    });

    return (
      <DropDownMenu
       value={selectedNamespace}
       onChange={this.handleSelect}>
        { options.map(option => <MenuItem key={option.value} value={option.value} primaryText={option.label} />) }
      </DropDownMenu>
    );
  }
}

function mapStateToProps(state) {
  const { namespaces } = state;
  const isFetching = namespaces.isFetching || false;
  const items = namespaces.items || [];
  const selectedNamespace = namespaces.selectedNamespace || "default";

  return {
    items,
    selectedNamespace,
    isFetching,
  }
}

export default connect(mapStateToProps)(NamespaceSelect)
