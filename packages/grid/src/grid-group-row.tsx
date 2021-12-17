import React from 'react';
import { Icon } from '@axelor-ui/core';
import { styleNames } from '@axelor-ui/core/styles';

import * as TYPES from './types';
import styles from './grid.module.css';

export const GridGroupRow = React.memo(function GridGroupRow(
  props: TYPES.GridRowProps
) {
  const { className, selected, data, index, renderer, onClick } = props;
  const { state, record } = data;
  const { level, value } = record;
  const RowRenderer = renderer || 'div';
  const rendererProps = renderer ? props : {};
  return (
    <RowRenderer
      {...rendererProps}
      className={styleNames(styles.row, styles.groupRow, className, {
        [styles.selected]: selected,
      })}
    >
      {new Array(level).fill(0).map((_, ind) => (
        <div key={ind} className={styles.groupSpacer} />
      ))}
      <div
        onClick={e => onClick && data && onClick(e as any, data, index)}
        className={styles.groupRowContent}
      >
        <Icon
          className={styles.groupRowIcon}
          use={state === 'close' ? 'caret-right-fill' : 'caret-down-fill'}
          size={1}
          title={state === 'close' ? 'Collapse' : 'Expand'}
        />
        {value}
      </div>
    </RowRenderer>
  );
});
