import React, { CSSProperties, useMemo } from "react";
import { findDataProp, makeTestId } from "../core/system/utils";
import { GridBodyRow } from "./grid-body-row";
import { GridDNDContainer } from "./grid-dnd-row";
import { GridFooterRow } from "./grid-footer-row";
import { GridGroupRow } from "./grid-group-row";
import styles from "./grid.module.scss";
import * as TYPES from "./types";
import { isRowVisible } from "./utils";

export interface GridBodyProps
  extends
    Pick<
      TYPES.GridState,
      "rows" | "columns" | "selectedCell" | "selectedRows" | "editRow"
    >,
    Pick<
      TYPES.GridProps,
      | "selectionType"
      | "rowHeight"
      | "maxRowHeight"
      | "noRecordsText"
      | "addNewText"
      | "cellRenderer"
      | "hasRowExpanded"
      | "allowRowDND"
      | "rowGroupHeaderRenderer"
      | "rowGroupFooterRenderer"
      | "rowDetailsRenderer"
      | "rowDetailsExpandIcon"
      | "rowRenderer"
      | "editRowRenderer"
      | "editRowColumnRenderer"
      | "onRecordAdd"
      | "onRecordSave"
      | "onRecordDiscard"
      | "onRowDoubleClick"
      | "onCellClick"
    > {
  onRowExpand?: (row: TYPES.GridRow) => void;
  onRowMove?: TYPES.GridRowProps["onMove"];
  onRowMoveStart?: TYPES.GridRowProps["onMoveStart"];
  onRowClick?: TYPES.GridRowProps["onClick"];
  onRecordUpdate?: TYPES.GridRowProps["onUpdate"];
}

export function GridBody(props: GridBodyProps) {
  const {
    rows = [],
    editRow,
    columns,
    selectedRows,
    selectedCell,
    selectionType,
    rowHeight,
    maxRowHeight,
    allowRowDND,
    hasRowExpanded,
    rowRenderer,
    cellRenderer,
    rowGroupHeaderRenderer,
    rowGroupFooterRenderer,
    rowDetailsRenderer,
    rowDetailsExpandIcon,
    editRowRenderer,
    editRowColumnRenderer,
    addNewText,
    noRecordsText,
    onRowExpand,
    onRecordAdd,
    onRecordSave,
    onRecordDiscard,
    onRecordUpdate,
    onCellClick,
    onRowMove,
    onRowMoveStart,
    onRowClick,
    onRowDoubleClick,
  } = props;

  const testId = findDataProp(props, "data-testid");

  const renderRows = React.useMemo(
    () =>
      rows.map((row) => ({
        row,
        visible: isRowVisible(rows, row),
      })),
    [rows],
  );
  const totalWidth = useMemo(
    () => columns.reduce((total, c) => total + (c.width || 0), 0),
    [columns],
  );

  const showNoRecords = noRecordsText && !addNewText;

  function render(children: React.ReactNode) {
    const bodyProps = {
      ...(showNoRecords ? { style: { width: totalWidth + 2 } } : {}),
      className: styles.body,
      role: "rowgroup",
      "data-testid": testId,
    };
    if (onRowMove || allowRowDND) {
      return (
        <GridDNDContainer
          {...bodyProps}
          rows={rows}
          onRowMove={onRowMove}
          onRowMoveStart={onRowMoveStart}
          data-testid={testId}
        >
          {children}
        </GridDNDContainer>
      );
    }
    return <div {...bodyProps}>{children}</div>;
  }
  const style = useMemo(() => {
    const style: CSSProperties = {};
    if (rowHeight) {
      style.height = rowHeight;
      style.maxHeight = rowHeight;
    }
    if (maxRowHeight) {
      style.maxHeight = maxRowHeight;
    }
    return style;
  }, [rowHeight, maxRowHeight]);

  return render(
    <>
      {renderRows.map(({ row, visible }, index) => {
        if (!visible) {
          return null;
        }

        let rowProps: any = {
          index,
          columns,
          data: row,
          className: `row-${index}`,
          selectionType,
          selectedCell:
            selectedCell && selectedCell[0] === index ? selectedCell[1] : null,
          selected: (selectedRows || []).includes(index),
          style,
          cellRenderer,
          onCellClick,
          onClick: onRowClick,
          onDoubleClick: onRowDoubleClick,
          onExpand: onRowExpand,
          onMove: onRowMove,
          onMoveStart: onRowMoveStart,
          onUpdate: onRecordUpdate,
        };

        if (editRow) {
          const [editRowIndex, editCellIndex] = editRow;
          if (editRowIndex === index) {
            rowProps = {
              ...rowProps,
              editCell: editCellIndex,
              renderer: editRowRenderer,
              cellRenderer: editRowColumnRenderer,
              onSave: onRecordSave,
              onCancel: onRecordDiscard,
              className: styles.editRow,
            };
          }
        }

        if (row.type === "group-row") {
          return (
            <GridGroupRow
              key={row.key}
              width={totalWidth}
              renderer={rowGroupHeaderRenderer}
              data-testid={makeTestId(testId, "group-row", row.key)}
              {...rowProps}
            />
          );
        }

        if (row.type === "footer-row") {
          return (
            <GridFooterRow
              key={row.key}
              width={totalWidth}
              renderer={rowGroupFooterRenderer}
              data-testid={makeTestId(testId, "footer-row", row.key)}
              {...rowProps}
            />
          );
        }

        return (
          <GridBodyRow
            key={row.key}
            width={totalWidth}
            draggable={Boolean(onRowMove)}
            renderer={rowRenderer}
            hasExpanded={hasRowExpanded}
            detailsRenderer={rowDetailsRenderer}
            detailsExpandIcon={rowDetailsExpandIcon}
            data-testid={makeTestId(testId, "row", row.key)}
            {...rowProps}
          />
        );
      })}
      {addNewText && (
        <div
          className={styles.addNewText}
          onClick={onRecordAdd}
          data-testid={makeTestId(testId, "add-new-row")}
          role="row"
        >
          {addNewText}
        </div>
      )}
      {showNoRecords && (
        <div
          className={styles.noRecordsText}
          data-testid={makeTestId(testId, "no-records-row")}
          role="row"
        >
          {noRecordsText}
        </div>
      )}
    </>,
  );
}
