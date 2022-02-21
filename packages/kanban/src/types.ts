import { RecordList } from './kanban-column';

export type ID = string | number;

export type Column = {
  id: ID;
  title: string;
  records?: Record[];
  readonly?: boolean;
  disableDrag?: boolean;
  renderer?: ColumnRenderer;
};

export type ColumnRenderer = React.JSXElementConstructor<{
  column: Column;
  readonly?: boolean;
  RecordList: typeof RecordList;
}>;

export type Record = {
  id: ID;
  title: string;
  renderer?: RecordRenderer;
};

export type RecordRenderer = React.JSXElementConstructor<{
  column: Column;
  record: Record;
}>;

export type CardEvent = {
  column: Column;
  index: number;
  source: Column;
  record: Record;
};

export type ColumnEvent = {
  column: Column;
  index: number;
};
