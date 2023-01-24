import React from 'react';
import { GridGroupRow } from './grid-group-row';
import { GridBodyRow } from './grid-body-row';
import { GridFooterRow } from './grid-footer-row';
import { GridDNDContainer } from './grid-dnd-row';
import { isRowVisible } from './utils';
import * as TYPES from './types';
import styles from './grid.module.scss';

export interface GridBodyProps
  extends Pick<
      TYPES.GridState,
      'rows' | 'columns' | 'selectedCell' | 'selectedRows' | 'editRow'
    >,
    Pick<
      TYPES.GridProps,
      | 'selectionType'
      | 'noRecordsText'
      | 'addNewText'
      | 'cellRenderer'
      | 'rowGroupHeaderRenderer'
      | 'rowGroupFooterRenderer'
      | 'rowRenderer'
      | 'editRowRenderer'
      | 'editRowColumnRenderer'
      | 'onRecordAdd'
      | 'onRecordSave'
      | 'onRecordDiscard'
      | 'onRowDoubleClick'
      | 'onCellClick'
    > {
  onRowMove?: TYPES.GridRowProps['onMove'];
  onRowClick?: TYPES.GridRowProps['onClick'];
  onRecordUpdate?: TYPES.GridRowProps['onUpdate'];
}

export function GridBody(props: GridBodyProps) {
  const {
    rows = [],
    editRow,
    columns,
    selectedRows,
    selectedCell,
    selectionType,
    rowRenderer,
    cellRenderer,
    rowGroupHeaderRenderer,
    rowGroupFooterRenderer,
    editRowRenderer,
    editRowColumnRenderer,
    addNewText,
    noRecordsText,
    onRecordAdd,
    onRecordSave,
    onRecordDiscard,
    onRecordUpdate,
    onCellClick,
    onRowMove,
    onRowClick,
    onRowDoubleClick,
  } = props;

  const renderRows = React.useMemo(
    () =>
      rows.map(row => ({
        row,
        visible: isRowVisible(rows, row),
      })),
    [rows]
  );
  const getTotalWidth = () =>
    columns.reduce((total, c) => total + (c.width || 0), 0);

  const showNoRecords = noRecordsText && !addNewText;

  function render(children: React.ReactNode) {
    const props = {
      ...(showNoRecords ? { style: { width: getTotalWidth() + 2 } } : {}),
      className: styles.body,
    };
    if (onRowMove) {
      return (
        <GridDNDContainer {...props} rows={rows} onRowMove={onRowMove}>
          {children}
        </GridDNDContainer>
      );
    }
    return <div {...props}>{children}</div>;
  }

  return render(
    <>
      {renderRows.map(({ row, visible }, index) => {
        if (!visible) {
          return null;
        }

        let rowProps: any = {
          key: row.key,
          index,
          columns,
          data: row,
          className: `row-${index}`,
          selectionType,
          selectedCell:
            selectedCell && selectedCell[0] === index ? selectedCell[1] : null,
          selected: (selectedRows || []).includes(index),
          cellRenderer,
          onCellClick,
          onClick: onRowClick,
          onDoubleClick: onRowDoubleClick,
          onMove: onRowMove,
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
            };
          }
        }

        if (row.type === 'group-row') {
          return (
            <GridGroupRow renderer={rowGroupHeaderRenderer} {...rowProps} />
          );
        }

        if (row.type === 'footer-row') {
          return (
            <GridFooterRow renderer={rowGroupFooterRenderer} {...rowProps} />
          );
        }

        return (
          <GridBodyRow
            draggable={Boolean(onRowMove)}
            renderer={rowRenderer}
            {...rowProps}
          />
        );
      })}
      {addNewText && (
        <div className={styles.addNewText} onClick={onRecordAdd}>
          {addNewText}
        </div>
      )}
      {showNoRecords && <div className={styles.noRecordsText}>{noRecordsText}</div>}
    </>
  );
}
