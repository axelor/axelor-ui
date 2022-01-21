import React from 'react';
import { Icon } from '@axelor-ui/core';
import { styleNames } from '@axelor-ui/core/styles';
import { ReactComponent as BiCaretRightFill } from 'bootstrap-icons/icons/caret-right-fill.svg';
import { ReactComponent as BiCaretDownFill } from 'bootstrap-icons/icons/caret-down-fill.svg';

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
          as={state === 'close' ? BiCaretRightFill : BiCaretDownFill}
          size={1}
          title={state === 'close' ? 'Collapse' : 'Expand'}
        />
        {value}
      </div>
    </RowRenderer>
  );
});
