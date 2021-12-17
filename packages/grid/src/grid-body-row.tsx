import React from 'react';
import { Input } from '@axelor-ui/core';
import { styleNames } from '@axelor-ui/core/styles';

import { GridColumn } from './grid-column';
import { isRowCheck } from './utils';
import * as TYPES from './types';
import styles from './grid.module.css';

export const GridBodyRow = React.memo(function GridBodyRow(
  props: TYPES.GridRowProps
) {
  const {
    className,
    columns = [],
    editCell,
    selected,
    selectedCell,
    data,
    index: rowIndex,
    selectionType,
    renderer,
    cellRenderer,
    onCellClick,
    onDoubleClick,
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
    if (isRowCheck(column)) {
      return (
        <Input
          type={selectionType === 'single' ? 'radio' : 'checkbox'}
          checked={selected}
          onChange={() => {}}
        />
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
});
