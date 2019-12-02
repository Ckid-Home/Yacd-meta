import React from 'react';
import { ChevronDown } from 'react-feather';
import prettyBytes from '../misc/pretty-bytes';
import { formatDistance } from 'date-fns';
import cx from 'classnames';
import { useTable, useSortBy } from 'react-table';

import s from './ConnectionTable.module.css';

const columns = [
  { accessor: 'id', show: false },
  { Header: 'Host', accessor: 'host' },
  { Header: 'Download', accessor: 'download' },
  { Header: 'Upload', accessor: 'upload' },
  { Header: 'Network', accessor: 'network' },
  { Header: 'Type', accessor: 'type' },
  { Header: 'Chains', accessor: 'chains' },
  { Header: 'Rule', accessor: 'rule' },
  { Header: 'Time', accessor: 'start' },
  { Header: 'Source IP', accessor: 'sourceIP' },
  { Header: 'Source Port', accessor: 'sourcePort' },
  { Header: 'Designation IP', accessor: 'destinationIP' },
  { Header: 'Designation Port', accessor: 'destinationPort' }
];

function renderCell(cell, now) {
  switch (cell.column.id) {
    case 'start':
      return formatDistance(-cell.value, now);
    case 'download':
    case 'upload':
      return prettyBytes(cell.value);
    default:
      return cell.value;
  }
}

const sortById = { id: 'id', desc: true };
// const sortByStart = { id: 'start', desc: true };
const tableState = {
  sortBy: [
    // maintain a more stable order
    sortById
  ]
};

function tableReducer(newState, action, _prevState) {
  const { type } = action;
  if (type === 'toggleSortBy') {
    const { sortBy = [] } = newState;
    if (sortBy.length === 0) {
      return {
        ...newState,
        sortBy: [sortById]
      };
    }
  }
  return newState;
}

function Table({ data }) {
  const now = new Date();
  const {
    getTableProps,
    // getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      initialState: tableState,
      reducer: tableReducer
    },
    useSortBy
  );
  return (
    <div {...getTableProps()}>
      <div className={s.thead}>
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className={s.tr}>
            {headerGroup.headers.map(column => (
              <div
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={s.th}
              >
                <span>{column.render('Header')}</span>
                <span className={s.sortIconContainer}>
                  {column.isSorted ? (
                    <span className={column.isSortedDesc ? '' : s.rotate180}>
                      <ChevronDown size={16} />
                    </span>
                  ) : null}
                </span>
              </div>
            ))}

            {rows.map((row, i) => {
              prepareRow(row);
              return row.cells.map((cell, j) => {
                return (
                  <div
                    {...cell.getCellProps()}
                    className={cx(
                      s.td,
                      i % 2 === 0 ? s.odd : false,
                      j === 1 || j === 2 ? s.du : false
                    )}
                  >
                    {renderCell(cell, now)}
                  </div>
                );
              });
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Table;