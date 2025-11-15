import React, { useId, useMemo } from "react";

import { Box, Input, clsx, useClassNames } from "../core";
import { findDataProp, makeTestId } from "../core/system/utils";
import { MaterialIcon } from "../icons/material-icon";
import { GridColumn } from "./grid-column";
import { GridDNDRow } from "./grid-dnd-row";
import { useTranslation } from "./translate";
import { isRowCheck, isRowExpand } from "./utils";

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

  const checkboxId = useId();
  const t = useTranslation();

  const expandState = useMemo(
    () => (hasExpanded ? hasExpanded(data) : { expand: Boolean(data.expand) }),
    [data, hasExpanded],
  );

  const handleUpdate = React.useCallback(
    (values: any) => {
      onUpdate?.(rowIndex, values);
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
        onCellClick?.(e, cell, cellIndex, data, rowIndex);
      }, 50);
      onClick?.(e, data, rowIndex, cellIndex, cell);
    },
    [data, rowIndex, onCellClick, onClick],
  );

  const renderCheckbox = React.useCallback(
    () => (
      <Input
        id={checkboxId}
        type={selectionType === "single" ? "radio" : "checkbox"}
        checked={selected}
        onChange={() => {}}
        m={0}
        tabIndex={-1}
        aria-label={t("Select row")}
      />
    ),
    [checkboxId, selectionType, selected, t],
  );

  const renderExpandIcon = React.useCallback(() => {
    const { expand, disable } = expandState;
    return (
      <Box
        d="inline-flex"
        className={clsx(styles.expandRowIcon, {
          [styles.disabled]: disable,
        })}
        role="button"
        aria-label={expand ? t("Collapse row") : t("Expand row")}
        aria-expanded={expand}
        tabIndex={disable ? -1 : 0}
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
  }, [ExpandIcon, data, expandState, onExpand, t]);

  const RowComponent = renderer || "div";
  const rendererProps = renderer ? props : {};
  const classNames = useClassNames();
  const DragComponent: any = draggable ? GridDNDRow : React.Fragment;
  const borderWidth = 1;
  const testId = findDataProp(props, "data-testid");

  function collectColumnProps(column: TYPES.GridColumn) {
    if (isRowCheck(column)) {
      return { renderChildren: renderCheckbox };
    }
    if (isRowExpand(column)) {
      return { renderChildren: renderExpandIcon };
    }
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
          role="row"
          aria-selected={selected || undefined}
          style={style}
          onDoubleClick={(e) =>
            onDoubleClick && onDoubleClick(e, data, rowIndex)
          }
          data-testid={testId}
          data-rowkey={data.key}
          data-groupkey={data.parent}
        >
          {columns.map((column, index) => (
            <GridBodyRowColumn
              key={column.id ?? column.name}
              data={column}
              index={index}
              type="body"
              record={data.record}
              focus={editCell === index}
              selected={selectedCell === index}
              renderer={column.renderer || cellRenderer}
              onClick={handleCellClick}
              onUpdate={handleUpdate}
              data-testid={makeTestId(testId, "column", column.name)}
              {...collectColumnProps(column)}
            />
          ))}
        </RowComponent>
      </DragComponent>
      {RowDetails && expandState?.expand && (
        <div
          className={styles.detailsRow}
          data-details-rowkey={data.key}
          data-testid={makeTestId(testId, "details", data.key)}
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

function GridBodyRowColumn(
  props: TYPES.GridColumnProps & {
    record: TYPES.GridRow["record"];
    renderChildren?: (
      column: TYPES.GridColumn,
      value: TYPES.GridColumnProps["value"],
    ) => React.ReactNode;
  },
) {
  const { record, data: column } = props;
  const { valueGetter, formatter } = column;

  const rawValue = useMemo(
    () => (valueGetter ? valueGetter(column, record) : record[column.name]),
    [valueGetter, column, record],
  );

  const value = useMemo(
    () => (formatter ? formatter(column, rawValue, record) : rawValue),
    [column, formatter, rawValue, record],
  );

  return <GridColumn {...props} {...{ value, rawValue, children: value }} />;
}
