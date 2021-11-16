import React from 'react';
import {
  Input,
  Icon,
  Popper,
  List,
  ListItem,
  ClickAwayListener,
} from '@axelor-ui/core';
import { styleNames } from '@axelor-ui/core/styles';

import { GridColumn, GridColumnProps } from './grid-column';
import { GridColumResizer } from './grid-column-resizer';
import GridDragElement, { DropHandler } from './grid-drag-element';
import * as TYPES from './types';
import styles from './grid.module.css';

export type ResizeHandler = (
  e: React.SyntheticEvent,
  column: TYPES.GridColumn,
  index: number
) => void;

export interface GridHeaderColumnProps extends GridColumnProps {
  sort?: null | 'asc' | 'desc';
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

export function GridHeaderColumn(props: GridHeaderColumnProps) {
  const [dropdownEl, setDropdownEl] = React.useState<HTMLSpanElement | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const {
    data,
    sort,
    index,
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

  function handleDropdownClose(cb: () => void) {
    hideDropdown();
    cb();
  }

  function renderColumn(column: TYPES.GridColumn, index: number) {
    if (column.type === 'row-checked') {
      const canCheck = Boolean(onCheckAll);
      return (
        <span className={styles.headerColumnTitle}>
          <Input
            type="checkbox"
            key={canCheck ? 'check-all' : 'check-all-disable'}
            {...(onCheckAll
              ? {
                  onChange: e =>
                    onCheckAll((e.target as HTMLInputElement).checked),
                }
              : { defaultChecked: false })}
          />
        </span>
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

        <Popper
          open={dropdownOpen}
          target={dropdownEl}
          placement={'bottom-start'}
        >
          <ClickAwayListener onClickAway={hideDropdown}>
            <List className={styles.headerColumnDropdownList}>
              {onSort && (
                <ListItem>
                  <span
                    onClick={e =>
                      handleDropdownClose(() => onSort(e, data, index, 'asc'))
                    }
                  >
                    Sort Ascending
                  </span>
                  <span
                    onClick={e =>
                      handleDropdownClose(() => onSort(e, data, index, 'desc'))
                    }
                  >
                    Sort Descending
                  </span>
                </ListItem>
              )}
              {(onGroup || onUngroup) && (
                <ListItem>
                  <span
                    onClick={e =>
                      handleDropdownClose(
                        () => onGroup && onGroup(e, { name: data.name })
                      )
                    }
                  >
                    Group by <i>{data.title}</i>
                  </span>
                  <span
                    onClick={e =>
                      handleDropdownClose(
                        () => onUngroup && onUngroup(e, { name: data.name })
                      )
                    }
                  >
                    Ungroup
                  </span>
                </ListItem>
              )}
              {(onHide || onShow) && (
                <ListItem>
                  {onHide && (
                    <span
                      onClick={e => handleDropdownClose(() => onHide(e, data))}
                    >
                      Hide <i>{data.title}</i>
                    </span>
                  )}
                  {onShow &&
                    (hiddenColumns || []).map(column => (
                      <span
                        key={column.name}
                        onClick={e =>
                          handleDropdownClose(() => onShow(e, column))
                        }
                      >
                        Show <i>{column.title}</i>
                      </span>
                    ))}
                </ListItem>
              )}
              {onCustomize && (
                <ListItem
                  onClick={e => handleDropdownClose(() => onCustomize(e, data))}
                >
                  <span>Customize...</span>
                </ListItem>
              )}
            </List>
          </ClickAwayListener>
        </Popper>

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
