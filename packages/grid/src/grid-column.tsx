import React from 'react';
import { styleNames } from '@axelor-ui/core/styles';
import * as TYPES from './types';
import styles from './grid.module.css';

export interface GridColumnProps {
  data: TYPES.GridColumn;
  index: number;
  value?: any;
  selected?: boolean;
  focus?: boolean;
  renderer?: TYPES.Renderer;
  onClick?: (
    e: React.SyntheticEvent,
    column: TYPES.GridColumn,
    columnIndex: number
  ) => void;
  children?: any;
}

export function GridColumn(props: GridColumnProps) {
  const { children, data, index, selected, renderer, onClick } = props;
  const { width } = data;
  const ColumnComponent = renderer || 'div';
  const rendererProps = renderer ? props : {};
  return (
    <ColumnComponent
      {...rendererProps}
      onClick={e => onClick && onClick(e, data, index)}
      className={styleNames(styles.column, { [styles.selected]: selected })}
      style={{ minWidth: width, width }}
    >
      {children}
    </ColumnComponent>
  );
}
