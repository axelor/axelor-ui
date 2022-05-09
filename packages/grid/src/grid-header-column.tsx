import React from 'react';
import { Box, Input, Icon } from '@axelor-ui/core';
import { useClassNames } from '@axelor-ui/core';
import { ReactComponent as BiSortUpAlt } from 'bootstrap-icons/icons/sort-up-alt.svg';
import { ReactComponent as BiSortDownAlt } from 'bootstrap-icons/icons/sort-down-alt.svg';

import { GridColumn, GridColumnProps } from './grid-column';
import { GridColumResizer } from './grid-column-resizer';
import { isRowCheck } from './utils';
import * as TYPES from './types';
import styles from './grid.module.css';

export type ResizeHandler = (
  e: React.SyntheticEvent,
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

  function renderColumn(column: TYPES.GridColumn, index: number) {
    if (isRowCheck(column)) {
      return (
        selectionType !== 'single' && (
          <GridHeaderCheckbox checkType={checkType} onCheckAll={onCheckAll} />
        )
      );
    }

    return (
      <>
        <span
          className={styles.headerColumnTitle}
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

        {onResizeStart && onResize && onResizeEnd && (
          <GridColumResizer
            className={styles.columnResizer}
            draggable={true}
            onDragStart={(e: React.SyntheticEvent) =>
              onResizeStart(e, column, index)
            }
            onDragEnd={(e: React.SyntheticEvent) =>
              onResizeEnd(e, column, index)
            }
            onDrag={(e: React.SyntheticEvent) => onResize(e, column, index)}
          />
        )}
      </>
    );
  }

  return (
    <GridColumn type="header" index={index} data={data}>
      {renderColumn(data, index)}
    </GridColumn>
  );
});
