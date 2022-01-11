import React from 'react';
import { ReactComponent as BiSortUpAlt } from 'bootstrap-icons/icons/sort-up-alt.svg';
import { ReactComponent as BiSortDownAlt } from 'bootstrap-icons/icons/sort-down-alt.svg';

import * as TYPES from './types';
import { styleNames } from '../styles';
import styles from './tree.module.css';
import { Icon } from '../icon';

export function TreeColumn({ data, sort, onSort }: TYPES.TreeColumnProps) {
  const { name, title } = data;
  return (
    <div
      key={name}
      className={styleNames(styles.headerColumn, styles.column)}
      onClick={e => onSort && onSort(data)}
    >
      {title}
      {sort && (
        <span className={styles.columnSortIcon}>
          <Icon
            as={sort === 'asc' ? BiSortUpAlt : BiSortDownAlt}
            size={1}
          />
        </span>
      )}
    </div>
  );
}
