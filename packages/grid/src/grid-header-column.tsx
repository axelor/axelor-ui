import React from 'react';
import { Box, Divider, Input, Icon, Menu, MenuItem } from '@axelor-ui/core';
import { styleNames } from '@axelor-ui/core/styles';

import GridDragElement, { DropHandler } from './grid-drag-element';
import { GridColumn, GridColumnProps } from './grid-column';
import { GridColumResizer } from './grid-column-resizer';
import { capitalizeWord, isRowCheck } from './utils';
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
  hiddenColumns?: TYPES.GridColumn[];
  groupBy?: TYPES.GridState['groupBy'];
  onCheckAll?: (checked: boolean) => void;
  onSort?: (
    e: React.SyntheticEvent,
    column: TYPES.GridColumn,
    columnIndex: number,
    sortOrder?: 'asc' | 'desc'
  ) => void;
  onHide?: (e: React.SyntheticEvent, column: TYPES.GridColumn) => void;
  onShow?: (e: React.SyntheticEvent, column: TYPES.GridColumn) => void;
  onGroup?: (e: React.SyntheticEvent, group: TYPES.GridGroup) => void;
  onUngroup?: (e: React.SyntheticEvent, group: TYPES.GridGroup) => void;
  onCustomize?: (e: React.SyntheticEvent, column: TYPES.GridColumn) => void;
  onDrop?: DropHandler;
  onResizeStart?: ResizeHandler;
  onResize?: ResizeHandler;
  onResizeEnd?: ResizeHandler;
}

function Italic({ children }: { children: React.ReactNode }) {
  return (
    <Box as="i" ms={1}>
      {children}
    </Box>
  );
}

function GridMenuItem(menuProps: {
  children: React.ReactNode;
  onClick: (e: React.SyntheticEvent) => void;
}) {
  return (
    <MenuItem as="button" className={styles.focusElement} {...menuProps} />
  );
}

function GridHeaderCheckbox({
  checkType,
  onCheckAll,
}: Pick<GridHeaderColumnProps, 'checkType' | 'onCheckAll'>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const canCheck = Boolean(onCheckAll);

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
    <span className={styleNames(styles.headerColumnTitle, styles.center)}>
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
  const [dropdownEl, setDropdownEl] = React.useState<HTMLSpanElement | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const {
    data,
    sort,
    index,
    checkType,
    selectionType,
    groupBy,
    hiddenColumns,
    onCheckAll,
    onSort,
    onShow,
    onHide,
    onCustomize,
    onDrop,
    onGroup,
    onUngroup,
    onClick,
    onResizeStart,
    onResize,
    onResizeEnd,
  } = props;
  const showDropdown = () => setDropdownOpen(true);
  const hideDropdown = () => setDropdownOpen(false);

  function handleDropdownClick(e: React.SyntheticEvent) {
    e.preventDefault();
    showDropdown();
  }

  function handleDropdownClose(e: React.SyntheticEvent, cb: () => void) {
    e.preventDefault();
    hideDropdown();
    cb();
  }

  function renderColumn(column: TYPES.GridColumn, index: number) {
    if (isRowCheck(column)) {
      return (
        selectionType !== 'single' && (
          <GridHeaderCheckbox checkType={checkType} onCheckAll={onCheckAll} />
        )
      );
    }

    function render() {
      return (
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
              use={sort === 'asc' ? 'sort-up-alt' : 'sort-down-alt'}
              title="Sort Icon"
            />
          )}
        </span>
      );
    }

    const hasDropdown =
      onSort || onHide || onShow || onGroup || onUngroup || onCustomize;

    return (
      <>
        {onDrop ? (
          <GridDragElement
            className={styles.dragColumn}
            column={column}
            onDrop={onDrop}
          >
            {render()}
          </GridDragElement>
        ) : (
          render()
        )}

        {hasDropdown && (
          <span
            ref={setDropdownEl}
            onClick={handleDropdownClick}
            className={styleNames(styles.headerColumnDropdown, {
              [styles.show]: dropdownOpen,
              [styles.hasResize]: Boolean(onResize),
            })}
          >
            <Icon size={1} use={'caret-down-fill'} title="Sort Icon" />
          </span>
        )}

        <Menu
          navigation
          target={dropdownEl}
          show={dropdownOpen}
          onHide={hideDropdown}
          className={styles.headerColumnDropdownList}
          placement="bottom"
          alignment="start"
        >
          <React.Fragment>
            {onSort && (
              <GridMenuItem
                onClick={e =>
                  handleDropdownClose(e, () => onSort(e, data, index, 'asc'))
                }
              >
                Sort Ascending
              </GridMenuItem>
            )}

            {onSort && (
              <GridMenuItem
                onClick={e =>
                  handleDropdownClose(e, () => onSort(e, data, index, 'desc'))
                }
              >
                Sort Descending
              </GridMenuItem>
            )}

            {onGroup && (
              <>
                {onSort && <Divider aria-disabled="true" />}
                <GridMenuItem
                  onClick={e =>
                    handleDropdownClose(
                      e,
                      () => onGroup && onGroup(e, { name: data.name })
                    )
                  }
                >
                  Group by <Italic>{data.title}</Italic>
                </GridMenuItem>
              </>
            )}

            {onUngroup &&
              groupBy &&
              groupBy.map(group => (
                <GridMenuItem
                  key={group.name}
                  onClick={e =>
                    handleDropdownClose(
                      e,
                      () => onUngroup && onUngroup(e, group)
                    )
                  }
                >
                  Ungroup by <Italic>{capitalizeWord(group.name)}</Italic>
                </GridMenuItem>
              ))}

            {onHide && (
              <>
                {(onSort || onGroup || onUngroup) && (
                  <Divider aria-disabled="true" />
                )}
                <GridMenuItem
                  onClick={e => handleDropdownClose(e, () => onHide(e, data))}
                >
                  Hide <Italic>{data.title}</Italic>
                </GridMenuItem>
              </>
            )}

            {onShow &&
              hiddenColumns &&
              hiddenColumns.map(column => (
                <GridMenuItem
                  key={column.name}
                  onClick={e => handleDropdownClose(e, () => onShow(e, column))}
                >
                  Show <Italic>{column.title}</Italic>
                </GridMenuItem>
              ))}

            {onCustomize && (
              <>
                <Divider aria-disabled="true" />
                <GridMenuItem
                  onClick={e =>
                    handleDropdownClose(e, () => onCustomize(e, data))
                  }
                >
                  <span>Customize...</span>
                </GridMenuItem>
              </>
            )}
          </React.Fragment>
        </Menu>

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
    <GridColumn index={index} data={data}>
      {renderColumn(data, index)}
    </GridColumn>
  );
});
