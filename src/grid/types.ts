import React, { CSSProperties, SyntheticEvent } from "react";

export interface GridColumn {
  id?: string;
  name: string;
  type?: string;
  title?: string;
  help?: string;
  width?: number;
  minWidth?: number;
  visible?: boolean;
  hidden?: boolean;
  computed?: boolean;
  sort?: boolean;
  editable?: boolean;
  sortable?: boolean;
  searchable?: boolean;
  action?: boolean;
  aggregate?: "sum" | "min" | "max" | "avg" | "count";
  formatter?: (column: GridColumn, value: any, record: any) => any;
  valueGetter?: (column: GridColumn, record: any) => any;
  renderer?: (props: any) => any;
  $changed?: boolean;
  $css?: string;
  $headerCss?: string;
}

export interface GridColumnProps {
  data: GridColumn;
  index: number;
  className?: string;
  value?: any;
  rawValue?: any;
  record?: GridRow["record"];
  type?: "header" | "footer" | "body";
  selected?: boolean;
  focus?: boolean;
  renderer?: Renderer;
  onUpdate?: GridRowProps["onUpdate"];
  onClick?: (
    e: React.SyntheticEvent,
    column: GridColumn,
    columnIndex: number,
  ) => void;
  children?: React.ReactNode;
}

export interface GridSortColumn {
  name: string;
  order: "asc" | "desc";
}

export interface GridGroup {
  name: string;
}

export interface GridRow {
  key: any;
  type: "row" | "group-row" | "footer-row";
  parent?: string | null;
  aggregate?: any;
  record?: any;
  state?: "open" | "close";
  expand?: boolean;
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
  ready?: boolean;
}

export type Renderer = (props: any) => React.ReactElement | null;
export type GridStateHandler = (state: GridState) => any;
export type GridLabel =
  | "Sum"
  | "Min"
  | "Max"
  | "Avg"
  | "Count"
  | "items"
  | "Sort Ascending"
  | "Sort Descending"
  | "Group by"
  | "Ungroup"
  | "Hide"
  | "Show"
  | "Customize..."
  | "Groups"
  | "No records found.";

export interface GridProps {
  className?: string;
  records: any[];
  columns: any[];
  state: GridState;
  setState: (state: GridState | GridStateHandler) => void;
  sortType?: "live" | "state";
  sortHandler?: (
    records: GridProps["records"],
    sortColumns: GridSortColumn[],
    allColumns: GridColumn[],
  ) => any[];
  resizeType?: "live" | "highlight";
  selectionType?: "single" | "multiple";
  aggregationType?: "group" | "all";
  rowType?: "fixed" | "variable";
  editable?: boolean;
  allowGrouping?: boolean;
  allowSearch?: boolean;
  allowSorting?: boolean;
  allowSelection?: boolean;
  allowCheckboxSelection?: boolean;
  allowCellSelection?: boolean;
  allowCellFocus?: boolean;
  allowColumnOptions?: boolean;
  allowColumnResize?: boolean;
  allowColumnCustomize?: boolean;
  allowColumnHide?: boolean;
  allowRowReorder?: boolean;
  allowRowExpand?: boolean;
  allowRowDND?: boolean; // enable row drag & drop
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  rowHeight?: number | string;
  maxRowHeight?: number | string;
  addNewText?: string | React.ReactNode;
  noRecordsText?: string | React.ReactNode;
  cellRenderer?: Renderer;
  rowRenderer?: Renderer;
  editRowRenderer?: Renderer;
  editRowColumnRenderer?: Renderer;
  headerRowRenderer?: Renderer;
  headerCellRenderer?: Renderer;
  footerRowRenderer?: Renderer;
  searchRowRenderer?: Renderer;
  searchColumnRenderer?: Renderer;
  rowDetailsRenderer?: Renderer;
  rowDetailsExpandIcon?: (props: {
    expand: boolean;
    disable?: boolean;
    children?: boolean;
  }) => React.ReactElement;
  rowGroupHeaderRenderer?: Renderer;
  rowGroupFooterRenderer?: Renderer;
  hasRowExpanded?: (row: GridRow) => {
    expand: boolean;
    disable?: boolean;
    children?: boolean;
  };
  onColumnCustomize?: (e: React.SyntheticEvent, column?: GridColumn) => void;
  onBeforeColumnResize?: (column: GridColumn) => void;
  onAfterColumnResize?: (column: GridColumn) => void;
  onRowClick?: (e: React.SyntheticEvent, row: any, rowIndex: number) => void;
  onRowDoubleClick?: (
    e: React.SyntheticEvent,
    row: GridRow,
    rowIndex: number,
  ) => void;
  onCellClick?: (
    e: React.SyntheticEvent,
    cell: any,
    cellIndex: number,
    row: GridRow,
    rowIndex: number,
  ) => void;
  onRowReorder?: (dragRow: GridRow, hoverRow: GridRow) => void;
  onRecordAdd?: () => void;
  onRecordEdit?: (
    row: any,
    rowIndex?: number,
    cell?: any,
    cellIndex?: number,
  ) => Promise<any>;
  onRecordSave?: (
    record: any,
    recordIndex: number,
    columnIndex: number,
    dirty?: boolean,
    saveFromEdit?: boolean,
  ) => any;
  onRecordDiscard?: (
    record: any,
    recordIndex: number,
    columnIndex: number,
  ) => void;
  onRowSelectionChange?: (rows: number[]) => void;
  onRowExpand?: (row: GridRow, expanded?: boolean) => void;
  translate?: (key: string) => null | string;
  labels?: Record<GridLabel, string>;
}

export interface GridRowProps {
  data: GridRow;
  index: number;
  width?: number;
  draggable?: boolean;
  className?: string;
  children?: any;
  style?: CSSProperties;
  columns?: GridColumn[];
  selected?: boolean;
  selectedCell?: null | number;
  editCell?: number | null;
  renderer?: Renderer;
  cellRenderer?: Renderer;
  hasExpanded?: GridProps["hasRowExpanded"];
  selectionType?: GridProps["selectionType"];
  detailsRenderer?: GridProps["rowDetailsRenderer"];
  detailsExpandIcon?: GridProps["rowDetailsExpandIcon"];
  onSave?: GridProps["onRecordSave"];
  onCancel?: GridProps["onRecordDiscard"];
  onCellClick?: GridProps["onCellClick"];
  onDoubleClick?: GridProps["onRowDoubleClick"];
  onMove?: (dragRow: GridRow, hoverRow: GridRow, isFirstRow?: boolean) => void;
  onMoveStart?: (dragInfo: any) => void;
  onClick?: (
    e: SyntheticEvent,
    row: GridRow,
    rowIndex: number,
    columnIndex?: number,
    column?: GridColumn,
  ) => void;
  onExpand?: (row: GridRow, expand?: boolean) => void;
  onUpdate?: (rowIndex: number, values: any) => void;
}

export interface DropObject extends GridColumn {
  $group?: boolean;
}
