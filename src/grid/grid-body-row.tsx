import React from "react";
import { Input } from "../core";
import { useClassNames } from "../core";

import { GridColumn } from "./grid-column";
import { isRowCheck } from "./utils";
import * as TYPES from "./types";
import styles from "./grid.module.scss";
import { GridDNDRow } from "./grid-dnd-row";

export const GridBodyRow = React.memo(function GridBodyRow(
  props: TYPES.GridRowProps
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
    renderer,
    cellRenderer,
    onCellClick,
    onDoubleClick,
    onClick,
    onUpdate,
  } = props;

  const handleUpdate = React.useCallback(
    (values: any) => {
      onUpdate && onUpdate(rowIndex, values);
    },
    [onUpdate, rowIndex]
  );

  const handleCellClick = React.useCallback(
    function handleCellClick(
      e: React.SyntheticEvent,
      cell: TYPES.GridColumn,
      cellIndex: number
    ) {
      setTimeout(() => {
        onCellClick && onCellClick(e, cell, cellIndex, data, rowIndex);
      }, 50);
      onClick && onClick(e, data, rowIndex, cellIndex, cell);
    },
    [data, rowIndex, onCellClick, onClick]
  );

  function getColumnValue(column: TYPES.GridColumn) {
    const value = data.record[column.name];
    return column.formatter
      ? column.formatter(column, value, data.record)
      : value;
  }

  function renderColumn(column: TYPES.GridColumn, value: any) {
    if (isRowCheck(column)) {
      return (
        <Input
          type={selectionType === "single" ? "radio" : "checkbox"}
          checked={selected}
          onChange={() => {}}
          m={0}
          tabIndex={-1}
        />
      );
    }
    return value;
  }

  const RowComponent = renderer || "div";
  const rendererProps = renderer ? props : {};
  const classNames = useClassNames();
  const DragComponent: any = draggable ? GridDNDRow : React.Fragment;

  return (
    <DragComponent {...(draggable ? { ...props } : {})}>
      <RowComponent
        {...rendererProps}
        className={classNames(styles.row, className, {
          [styles.selected]: selected,
          [styles.inner]: draggable,
        })}
        onDoubleClick={(e) => onDoubleClick && onDoubleClick(e, data, rowIndex)}
      >
        {columns.map((column, index) => {
          const value = getColumnValue(column);
          return (
            <GridColumn
              key={column.id ?? column.name}
              data={column}
              index={index}
              type="body"
              record={data.record}
              value={value}
              focus={editCell === index}
              selected={selectedCell === index}
              renderer={column.renderer || cellRenderer}
              onClick={handleCellClick}
              onUpdate={handleUpdate}
            >
              {renderColumn(column, value)}
            </GridColumn>
          );
        })}
      </RowComponent>
    </DragComponent>
  );
});
