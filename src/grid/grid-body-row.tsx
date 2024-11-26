import React, { useMemo } from "react";
import { Box, Input, clsx } from "../core";
import { useClassNames } from "../core";

import { GridColumn } from "./grid-column";
import { isRowCheck, isRowExpand } from "./utils";
import { MaterialIcon } from "../icons/material-icon";
import { GridDNDRow } from "./grid-dnd-row";
import * as TYPES from "./types";
import styles from "./grid.module.scss";

export const GridBodyRow = React.memo(function GridBodyRow(
  props: TYPES.GridRowProps,
) {
  const {
    draggable,
    className,
    columns = [],
    editCell,
    selected,
    selectedCell,
    data,
    index: rowIndex,
    selectionType,
    style,
    width,
    renderer,
    cellRenderer,
    hasExpanded,
    detailsRenderer: RowDetails,
    detailsExpandIcon: ExpandIcon,
    onCellClick,
    onDoubleClick,
    onClick,
    onExpand,
    onUpdate,
  } = props;

  const expandState = useMemo(
    () => (hasExpanded ? hasExpanded(data) : { expand: Boolean(data.expand) }),
    [data, hasExpanded],
  );

  const handleUpdate = React.useCallback(
    (values: any) => {
      onUpdate && onUpdate(rowIndex, values);
    },
    [onUpdate, rowIndex],
  );

  const handleCellClick = React.useCallback(
    function handleCellClick(
      e: React.SyntheticEvent,
      cell: TYPES.GridColumn,
      cellIndex: number,
    ) {
      setTimeout(() => {
        onCellClick && onCellClick(e, cell, cellIndex, data, rowIndex);
      }, 50);
      onClick && onClick(e, data, rowIndex, cellIndex, cell);
    },
    [data, rowIndex, onCellClick, onClick],
  );

  function getColumnValue(rawValue: any, column: TYPES.GridColumn) {
    return column.formatter
      ? column.formatter(column, rawValue, data.record)
      : rawValue;
  }

  function getColumnRawValue(column: TYPES.GridColumn) {
    return column.valueGetter
      ? column.valueGetter(column, data.record)
      : data.record[column.name];
  }

  const renderCheckbox = React.useCallback(
    () => (
      <Input
        type={selectionType === "single" ? "radio" : "checkbox"}
        checked={selected}
        onChange={() => {}}
        m={0}
        tabIndex={-1}
      />
    ),
    [selectionType, selected],
  );

  const renderExpandIcon = React.useCallback(() => {
    const { expand, disable } = expandState;
    return (
      <Box
        d="inline-flex"
        className={clsx(styles.expandRowIcon, {
          [styles.disabled]: disable,
        })}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          !disable && onExpand?.(data, !expand);
        }}
      >
        {ExpandIcon ? (
          <ExpandIcon {...expandState} />
        ) : (
          <MaterialIcon icon={expand ? "arrow_drop_down" : "arrow_right"} />
        )}
      </Box>
    );
  }, [ExpandIcon, data, expandState, onExpand]);

  const RowComponent = renderer || "div";
  const rendererProps = renderer ? props : {};
  const classNames = useClassNames();
  const DragComponent: any = draggable ? GridDNDRow : React.Fragment;
  const borderWidth = 1;

  function collectColumnProps(column: TYPES.GridColumn, value: any) {
    if (isRowCheck(column)) {
      return { renderChildren: renderCheckbox };
    }
    if (isRowExpand(column)) {
      return { renderChildren: renderExpandIcon };
    }
    return { children: value };
  }

  return (
    <>
      <DragComponent {...(draggable ? { ...props } : {})}>
        <RowComponent
          {...rendererProps}
          className={classNames(styles.row, className, {
            [styles.selected]: selected,
            [styles.inner]: draggable,
          })}
          style={style}
          onDoubleClick={(e) =>
            onDoubleClick && onDoubleClick(e, data, rowIndex)
          }
        >
          {columns.map((column, index) => {
            const rawValue = getColumnRawValue(column);
            const value = getColumnValue(rawValue, column);
            return (
              <GridColumn
                key={column.id ?? column.name}
                data={column}
                index={index}
                type="body"
                record={data.record}
                value={value}
                rawValue={rawValue}
                focus={editCell === index}
                selected={selectedCell === index}
                renderer={column.renderer || cellRenderer}
                onClick={handleCellClick}
                onUpdate={handleUpdate}
                {...collectColumnProps(column, value)}
              />
            );
          })}
        </RowComponent>
      </DragComponent>
      {RowDetails && expandState?.expand && (
        <div
          className={styles.detailsRow}
          data-row-details={`${data.key}`}
          {...(width && {
            style: {
              width: width + borderWidth * 2, // add left + right border width
            },
          })}
        >
          <RowDetails
            data={data}
            onClose={() => onExpand?.(data, Boolean(!expandState?.expand))}
          />
        </div>
      )}
    </>
  );
});
