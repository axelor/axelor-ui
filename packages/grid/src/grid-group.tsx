import React from 'react';
import { Icon } from '@axelor-ui/core';
import { styleNames } from '@axelor-ui/core/styles';
import { ReactComponent as BiArrowUp } from 'bootstrap-icons/icons/arrow-up.svg';
import { ReactComponent as BiArrowDown } from 'bootstrap-icons/icons/arrow-down.svg';
import { ReactComponent as BiX } from 'bootstrap-icons/icons/x.svg';

import GridDragWidget from './grid-drag-element';
import * as TYPES from './types';
import styles from './grid.module.css';

const GridGroupTag = ({
  name,
  title,
  sort,
  onClick,
  onDrop,
  onRemove,
}: {
  name: string;
  title?: string;
  sort?: null | 'asc' | 'desc';
  onClick?: (e: React.SyntheticEvent, group: TYPES.GridGroup) => void;
  onDrop?: (dest: any, target: any) => void;
  onRemove?: (e: React.SyntheticEvent, group: TYPES.GridGroup) => void;
}) => {
  const data = { name, title };
  return (
    <GridDragWidget
      className={styles.groupTagWrapper}
      group={data}
      onDrop={onDrop}
    >
      <div
        onClick={e => onClick && onClick(e, data)}
        className={styles.groupTag}
      >
        {sort && (
          <span className={styles.groupTagIcon}>
            <Icon as={sort === 'asc' ? BiArrowUp : BiArrowDown} />
          </span>
        )}
        <label className={styles.groupTagTitle}>{data.title}</label>
        <span
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onRemove && onRemove(e, data);
          }}
          className={styles.groupTagRemove}
        >
          <Icon size={2} as={BiX} />
        </span>
      </div>
    </GridDragWidget>
  );
};

export interface GridGroupProps
  extends Pick<TYPES.GridState, 'columns' | 'groupBy' | 'orderBy'> {
  groupingText?: string;
  onGroupTagClick?: (e: React.SyntheticEvent, group: TYPES.GridGroup) => void;
  onGroupTagRemove?: (e: React.SyntheticEvent, group: TYPES.GridGroup) => void;
  onGroupTagDrop?: (dest: any, target: any) => void;
}

export const GridGroup = React.memo(function GridGroup(props: GridGroupProps) {
  const {
    groupingText,
    columns,
    groupBy,
    orderBy,
    onGroupTagRemove,
    onGroupTagClick,
    onGroupTagDrop,
  } = props;

  return groupBy && groupBy.length ? (
    <div className={styles.groupTagContainer}>
      {groupBy.map(group => {
        const sort = (orderBy || []).find(x => x.name === group.name);
        const column = columns.find(x => x.name === group.name);
        return (
          <GridGroupTag
            key={group.name}
            title={column && column.title}
            name={group.name}
            sort={sort ? sort.order : null}
            onRemove={onGroupTagRemove}
            onClick={onGroupTagClick}
            onDrop={onGroupTagDrop}
          />
        );
      })}
      <GridDragWidget
        canDrag={false}
        className={styles.groupDumpTag}
        onDrop={onGroupTagDrop}
      />
    </div>
  ) : (
    <GridDragWidget
      canDrag={false}
      className={styleNames(styles.groupTagContainer, styles.groupDumpTag)}
      onDrop={onGroupTagDrop}
    >
      <div className={styles.groupDumpText}>{groupingText}</div>
    </GridDragWidget>
  );
});
