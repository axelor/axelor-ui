import React from 'react';
import { ReactComponent as BiSortUpAlt } from 'bootstrap-icons/icons/sort-up-alt.svg';
import { ReactComponent as BiSortDownAlt } from 'bootstrap-icons/icons/sort-down-alt.svg';

import * as TYPES from './types';
import { useClassNames } from '../styles';
import styles from './tree.module.css';
import { Icon } from '../icon';

export function TreeColumn({
  className,
  data,
  children,
  onClick,
}: TYPES.TreeColumnProps) {
  const { name, width } = data;
  const classNames = useClassNames();
  return (
    <div
      key={name}
      className={classNames(className, styles.column)}
      onClick={e => onClick && onClick(e, data)}
      {...(width ? { style: { width, maxWidth: width } } : {})}
    >
      {children}
    </div>
  );
}

export function TreeHeaderColumn({
  data,
  sort,
  onSort,
}: TYPES.TreeHeaderColumnProps) {
  const { title } = data;
  return (
    <TreeColumn data={data} className={styles.headerColumn} onClick={onSort}>
      {title}
      {sort && (
        <span className={styles.columnSortIcon}>
          <Icon as={sort === 'asc' ? BiSortUpAlt : BiSortDownAlt} size={1} />
        </span>
      )}
    </TreeColumn>
  );
}
