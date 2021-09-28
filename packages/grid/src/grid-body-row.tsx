import React from 'react';
import { Input } from '@axelor-ui/core';
import { styleNames } from '@axelor-ui/core/styles';

import { GridColumn } from './grid-column';
import * as TYPES from './types';
import styles from './grid.module.css';

export function GridBodyRow(props: TYPES.GridRowProps) {
  const {
    className,
    columns = [],
    editCell,
    selected,
    selectedCell,
    data,
    index: rowIndex,
    renderer,
    cellRenderer,
    onCellClick,
    onDoubleClick,
    onMove,
    onClick,
  } = props;

  const handleCellClick = React.useCallback(
    function handleCellClick(e, cell, cellIndex) {
      onCellClick && onCellClick(e, cell, cellIndex, data, rowIndex);
      onClick && onClick(e, data, rowIndex, cellIndex);
    },
    [data, rowIndex]
  );

  function renderColumn(column: TYPES.GridColumn) {
    if (column.type === 'row-checked') {
      return (
        <Input type="checkbox" checked={selected} onChange={console.log} />
      );
    }
    return data.record[column.name];
  }

  const RowComponent = renderer || 'div';
  const rendererProps = renderer ? props : {};

  return (
    <>
      <RowComponent
        {...rendererProps}
        className={styleNames(styles.row, className, {
          [styles.selected]: selected,
        })}
        onDoubleClick={e => onDoubleClick && onDoubleClick(e, data, rowIndex)}
      >
        {columns.map((column, index) => (
          <GridColumn
            key={column.name}
            data={column}
            index={index}
            value={data.record[column.name]}
            focus={editCell === index}
            selected={selectedCell === index}
            renderer={cellRenderer || column.renderer}
            onClick={handleCellClick}
          >
            {renderColumn(column)}
          </GridColumn>
        ))}
      </RowComponent>
    </>
  );
}
