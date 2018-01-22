import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

export default class ResourceTable extends Component {

  render() {
    const { tableHeaderItems, items, wide=false } = this.props;

    return (
        <Table selectable={false} >
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              { tableHeaderItems.map(item => itemToRow(item, TableHeaderColumn)) }
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
              { items.map(row => {
                return (
                  <TableRow key={row[0].key === undefined ? row[0] : row[0].key}>
                    { row.map(cell => itemToRow(cell)) }
                  </TableRow>);
              }) }
          </TableBody>
        </Table>
    );
  }
}

ResourceTable.propTypes = {
    tableHeaderItems: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    wide: PropTypes.bool,
};

function itemToRow(item, component=TableRowColumn) {
    const key = item.key === undefined ? item : item.key;
    const value = item.value === undefined ? item : item.value;

    if (key.toString() === 'undefined' || value.toString() === 'undefined') {
      throw new Error(`Invalid item passed to itemToRow: ${JSON.stringify(item)}`);
    }

    return React.createElement(component, {key: key}, value);
}
