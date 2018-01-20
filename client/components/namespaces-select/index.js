import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

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

  handleSelect(selectedOption) {
    const { dispatch, onChange } = this.props

    dispatch(setSelectedNamespace(selectedOption.label))
    if (onChange) {
        onChange(selectedOption.label);
    }
  }

  render() {
    const { items, selectedNamespace, isFetching, lastUpdated, wide } = this.props;

    const options = items.map((namespace) => {
      const name = namespace.metadata.name;
      return { value: name, label: name };
    });

    return (
      <Select
              value={selectedNamespace}
              options={options}
              onChange={this.handleSelect}
              isLoading={isFetching}
              clearable={false}
              name="namespaces-select"
       />
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
