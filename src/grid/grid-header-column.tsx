import React from 'react';
import { Divider, Box, Input, Icon } from '../core';
import { useClassNames } from '../core';
import { ReactComponent as BiSortUpAlt } from 'bootstrap-icons/icons/sort-up-alt.svg';
import { ReactComponent as BiSortDownAlt } from 'bootstrap-icons/icons/sort-down-alt.svg';

import { GridColumn, GridColumnProps } from './grid-column';
import { GridColumResizer } from './grid-column-resizer';
import { isRowCheck } from './utils';
import * as TYPES from './types';
import styles from './grid.module.scss';

export type ResizeHandler = (
  e: React.DragEvent<HTMLElement>,
  column: TYPES.GridColumn,
  index: number
) => void;

export interface GridHeaderColumnProps extends GridColumnProps {
  sort?: null | 'asc' | 'desc';
  checkType?: 'checked' | 'unchecked' | 'indeterminate';
  selectionType?: TYPES.GridProps['selectionType'];
  groupBy?: TYPES.GridState['groupBy'];
  onCheckAll?: (checked: boolean) => void;
  onResizeStart?: ResizeHandler;
  onResize?: ResizeHandler;
  onResizeEnd?: ResizeHandler;
}

function GridHeaderCheckbox({
  checkType,
  onCheckAll,
}: Pick<GridHeaderColumnProps, 'checkType' | 'onCheckAll'>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const canCheck = Boolean(onCheckAll);
  const classNames = useClassNames();
  React.useEffect(() => {
    const input = inputRef.current;
    if (checkType && input) {
      let checked = false,
        indeterminate = false;
      if (checkType === 'checked') {
        checked = true;
      } else if (checkType === 'indeterminate') {
        indeterminate = true;
      }
      input.checked = checked;
      input.indeterminate = indeterminate;
    }
  }, [canCheck, checkType]);

  return (
    <span className={classNames(styles.headerColumnTitle, styles.center)}>
      <Input
        ref={inputRef}
        type="checkbox"
        key={canCheck ? 'check-all' : 'check-all-disable'}
        {...(onCheckAll
          ? {
              onChange: e => onCheckAll((e.target as HTMLInputElement).checked),
            }
          : { defaultChecked: false })}
      />
    </span>
  );
}

export const GridHeaderColumn = React.memo(function GridHeaderColumn(
  props: GridHeaderColumnProps
) {
  const {
    data,
    sort,
    index,
    checkType,
    selectionType,
    onCheckAll,
    onClick,
    onResizeStart,
    onResize,
    onResizeEnd,
  } = props;
  const classNames = useClassNames();

  function renderColumn(column: TYPES.GridColumn, index: number) {
    if (isRowCheck(column)) {
      return (
        selectionType !== 'single' && (
          <GridHeaderCheckbox checkType={checkType} onCheckAll={onCheckAll} />
        )
      );
    }

    const canResize = column.name !== '__reorder__' && !column.action;

    return (
      <>
        <span
          className={classNames(styles.headerColumnTitle, {
            [styles.resizable]: Boolean(onResize),
          })}
          onClick={e => onClick && onClick(e, data, index)}
        >
          <Box as="span" flex={1}>
            {column.title}
          </Box>
          {sort && (
            <Icon
              size={1}
              as={sort === 'asc' ? BiSortUpAlt : BiSortDownAlt}
              title="Sort Icon"
            />
          )}
        </span>

        {canResize && onResizeStart && onResize && onResizeEnd ? (
          <GridColumResizer
            className={styles.columnResizer}
            draggable={true}
            onDragStart={(e: React.DragEvent<HTMLElement>) =>
              onResizeStart(e, column, index)
            }
            onDragEnd={(e: React.DragEvent<HTMLElement>) =>
              onResizeEnd(e, column, index)
            }
            onDrag={(e: React.DragEvent<HTMLElement>) =>
              onResize(e, column, index)
            }
          />
        ) : (
          <span className={classNames(styles.columnResizer, styles.fixed)}>
            <Divider vertical />
          </span>
        )}
      </>
    );
  }

  return (
    <GridColumn
      {...(data.action
        ? {
            className: styles.action,
          }
        : {})}
      type="header"
      index={index}
      data={data}
    >
      {renderColumn(data, index)}
    </GridColumn>
  );
});