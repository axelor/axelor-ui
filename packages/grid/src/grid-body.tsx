import React from 'react';
import { GridSearchRow } from './grid-search-row';
import { GridGroupRow } from './grid-group-row';
import { GridBodyRow } from './grid-body-row';
import { GridFooterRow } from './grid-footer-row';
import { GridDNDRow } from './grid-dnd-row';
import { isRowVisible } from './utils';
import * as TYPES from './types';
import styles from './grid.module.css';

export interface GridBodyProps
  extends Pick<
      TYPES.GridState,
      'rows' | 'columns' | 'selectedCell' | 'selectedRows' | 'editRow'
    >,
    Pick<
      TYPES.GridProps,
      | 'selectionType'
      | 'cellRenderer'
      | 'rowGroupHeaderRenderer'
      | 'rowGroupFooterRenderer'
      | 'rowRenderer'
      | 'searchRowRenderer'
      | 'searchColumnRenderer'
      | 'editRowRenderer'
      | 'editRowColumnRenderer'
      | 'onRecordSave'
      | 'onRecordDiscard'
      | 'onRowDoubleClick'
      | 'onCellClick'
    > {
  onRowMove?: TYPES.GridRowProps['onMove'];
  onRowClick?: TYPES.GridRowProps['onClick'];
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
    searchRowRenderer,
    searchColumnRenderer,
    onRecordSave,
    onRecordDiscard,
    onCellClick,
    onRowMove,
    onRowClick,
    onRowDoubleClick,
  } = props;

  const renderRows = React.useMemo(() => {
    return rows.map(row => ({
      row,
      visible: isRowVisible(rows, row),
    }));
  }, [rows]);

  return (
    <div className={styles.body}>
      {searchRowRenderer && searchColumnRenderer && (
        <GridSearchRow
          {...{
            columns,
            searchRowRenderer,
            searchColumnRenderer,
          }}
        />
      )}

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
            renderer={onRowMove ? GridDNDRow : rowRenderer}
            {...rowProps}
          />
        );
      })}
    </div>
  );
}
