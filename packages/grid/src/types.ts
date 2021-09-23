import React, { SyntheticEvent } from 'react';

export interface GridColumn {
  name: string;
  type?: string;
  title?: string;
  width?: number;
  visible?: boolean;
  computed?: boolean;
  sort?: boolean;
  aggregate?: 'sum' | 'min' | 'max' | 'avg' | 'count';
  formatter?: (data: any, column: GridColumn) => any;
  $changed?: boolean;
}

export interface GridSortColumn {
  name: string;
  order: 'asc' | 'desc';
}

export interface GridGroup {
  name: string;
}

export interface GridRow {
  key: any;
  type: 'row' | 'group-row' | 'footer-row';
  parent?: string | null;
  aggregate?: any;
  record?: any;
  state?: 'open' | 'close';
}

export interface GridState {
  rows: GridRow[];
  columns: GridColumn[];
  scrollbar?: null | any[];
  editRow?: null | any[];
  orderBy?: null | GridSortColumn[];
  groupBy?: null | GridGroup[];
  selectedCell?: null | number[];
  selectedRows?: null | number[];
  selectedCols?: null | number[];
}

export type Renderer = (props: any) => React.ReactElement | null;
export type GridStateHandler = (state: GridState) => any;

export interface GridProps {
  className?: string;
  records: any[];
  columns: any[];
  state: GridState;
  setState: (state: GridState | GridStateHandler) => void;
  sortType?: 'live' | 'state';
  resizeType?: 'live' | 'highlight';
  selectionType?: 'single' | 'multiple';
  editable?: boolean;
  allowGrouping?: boolean;
  allowSearch?: boolean;
  allowSorting?: boolean;
  allowSelection?: boolean;
  allowCheckboxSelection?: boolean;
  allowCellSelection?: boolean;
  allowColumnResize?: boolean;
  allowColumnCustomize?: boolean;
  allowColumnHide?: boolean;
  allowRowReorder?: boolean;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  addNewText?: string;
  noRecordsText?: string;
  groupingText?: string;
  cellRenderer?: Renderer;
  rowRenderer?: Renderer;
  editRowRenderer?: Renderer;
  editRowColumnRenderer?: Renderer;
  headerRowRenderer?: Renderer;
  footerRowRenderer?: Renderer;
  searchRowRenderer?: Renderer;
  searchColumnRenderer?: Renderer;
  rowGroupHeaderRenderer?: Renderer;
  rowGroupFooterRenderer?: Renderer;
  onColumnCustomize?: (e: React.SyntheticEvent, column: GridColumn) => void;
  onRowClick?: (e: React.SyntheticEvent, row: any, rowIndex: number) => void;
  onRowDoubleClick?: (
    e: React.SyntheticEvent,
    row: GridRow,
    rowIndex: number
  ) => void;
  onCellClick?: (
    e: React.SyntheticEvent,
    cell: any,
    cellIndex: number,
    row: GridRow,
    rowIndex: number
  ) => void;
  onRowReorder?: (row: any, rowIndex: number, oldRowIndex: number) => void;
  onRecordEdit?: (record: any, recordIndex?: number) => void;
  onRecordSave?: (record: any, recordIndex?: number) => any;
  onRecordDiscard?: (record: any, recordIndex?: number) => void;
}

export interface GridRowProps {
  data: GridRow;
  index: number;
  className?: string;
  children?: any;
  columns?: GridColumn[];
  selected?: boolean;
  selectedCell?: null | number;
  editCell?: number | null;
  renderer?: Renderer;
  cellRenderer?: Renderer;
  onSave?: GridProps['onRecordSave'];
  onCancel?: GridProps['onRecordDiscard'];
  onCellClick?: GridProps['onCellClick'];
  onDoubleClick?: GridProps['onRowDoubleClick'];
  onClick?: (
    e: SyntheticEvent,
    row: GridRow,
    rowIndex: number,
    columnIndex?: number
  ) => void;
}
