import React from 'react';
import { useClassNames } from '@axelor-ui/core';
import * as TYPES from './types';

import { GridColumn } from './grid-column';
import { capitalizeWord } from './utils';
import { useTranslation } from './translate';
import styles from './grid.module.scss';

export const GridFooterRow = React.memo(function GridFooterRow(
  props: TYPES.GridRowProps
) {
  const {
    className,
    selected,
    selectedCell,
    columns = [],
    renderer,
    data,
  } = props;
  const t = useTranslation();
  const RowRenderer = renderer || 'div';
  const rendererProps = renderer ? props : {};
  const classNames = useClassNames();
  return (
    <RowRenderer
      {...rendererProps}
      className={classNames(styles.row, className, {
        [styles.selected]: selected,
      })}
    >
      {columns.map((column, index) => (
        <GridColumn
          key={column.name}
          selected={selectedCell === index}
          index={index}
          data={column}
          type="footer"
        >
          {column.aggregate
            ? `${t(capitalizeWord(column.aggregate))} : ${
                data.aggregate[column.name]
              }`
            : null}
        </GridColumn>
      ))}
    </RowRenderer>
  );
});
