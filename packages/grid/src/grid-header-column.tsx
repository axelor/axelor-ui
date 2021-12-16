import React from 'react';
import { Box, Input, Icon, Menu, MenuItem } from '@axelor-ui/core';
import { styleNames } from '@axelor-ui/core/styles';

import { GridColumn, GridColumnProps } from './grid-column';
import { GridColumResizer } from './grid-column-resizer';
import GridDragElement, { DropHandler } from './grid-drag-element';
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
  hiddenColumns?: TYPES.GridColumn[];
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

function GridMenuItem(menuProps: any) {
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
  }, [checkType]);

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

export function GridHeaderColumn(props: GridHeaderColumnProps) {
  const [dropdownEl, setDropdownEl] = React.useState<HTMLSpanElement | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const {
    data,
    sort,
    index,
    checkType,
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
        <GridHeaderCheckbox checkType={checkType} onCheckAll={onCheckAll} />
      );
    }

    function render() {
      return (
        <span
          className={styles.headerColumnTitle}
          onClick={e => onClick && onClick(e, data, index)}
        >
          {sort && (
            <Icon
              size={1}
              use={sort === 'asc' ? 'sort-up-alt' : 'sort-down-alt'}
              title="Sort Icon"
            />
          )}
          {column.title}
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
          disablePortal
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
              <GridMenuItem
                onClick={e =>
                  handleDropdownClose(
                    e,
                    () => onGroup && onGroup(e, { name: data.name })
                  )
                }
              >
                Group by <i>{data.title}</i>
              </GridMenuItem>
            )}

            {onUngroup && (
              <GridMenuItem
                onClick={e =>
                  handleDropdownClose(
                    e,
                    () => onUngroup && onUngroup(e, { name: data.name })
                  )
                }
              >
                Ungroup
              </GridMenuItem>
            )}

            {onHide && (
              <GridMenuItem
                onClick={e => handleDropdownClose(e, () => onHide(e, data))}
              >
                Hide <i>{data.title}</i>
              </GridMenuItem>
            )}

            {onShow && (
              <GridMenuItem
                onClick={e => handleDropdownClose(e, () => onShow(e, column))}
              >
                Show <i>{data.title}</i>
              </GridMenuItem>
            )}

            {onCustomize && (
              <GridMenuItem
                onClick={e =>
                  handleDropdownClose(e, () => onCustomize(e, data))
                }
              >
                <span>Customize...</span>
              </GridMenuItem>
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
}
