import React from 'react';
import { styleNames } from '@axelor-ui/core/styles';
import { GridColumn } from './grid-column';
import * as TYPES from './types';
import styles from './grid.module.css';

function capitalizeWord(word: string) {
  return (word[0] || '').toUpperCase() + (word || '').substring(1);
}

export function GridFooterRow(props: TYPES.GridRowProps) {
  const {
    className,
    selected,
    selectedCell,
    columns = [],
    renderer,
    data,
  } = props;
  const RowRenderer = renderer || 'div';
  const rendererProps = renderer ? props : {};
  return (
    <RowRenderer
      {...rendererProps}
      className={styleNames(styles.row, className, {
        [styles.selected]: selected,
      })}
    >
      {columns.map((column, index) => (
        <GridColumn
          key={column.name}
          selected={selectedCell === index}
          index={index}
          data={column}
        >
          {column.aggregate
            ? `${capitalizeWord(column.aggregate)} : ${
                data.aggregate[column.name]
              }`
            : null}
        </GridColumn>
      ))}
    </RowRenderer>
  );
}