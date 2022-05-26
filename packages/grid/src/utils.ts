import { useTheme } from '@axelor-ui/core';
import { GridColumn, GridGroup, GridRow, GridSortColumn } from './types';

export const GRID_CONFIG = {
  COLUMN_MIN_WIDTH: 100,
};

export const ROW_TYPE = {
  GROUP_ROW: 'group-row',
  FOOTER_ROW: 'footer-row',
  ROW: 'row',
};

export const isRowVisible = (rows: GridRow[], { parent }: any): boolean => {
  if (!parent) return true;
  const row = rows.find(x => x.key === parent);
  return (row || {}).state === 'open' && isRowVisible(rows, row);
};

export const isRowCheck = (column: GridColumn) => column.type === 'row-checked';

export const getRows = ({
  columns,
  orderBy,
  groupBy,
  records,
  rows,
}: {
  columns: GridColumn[];
  orderBy: undefined | null | GridSortColumn[];
  groupBy: undefined | null | GridGroup[];
  records: any[];
  rows: GridRow[];
}) => {
  let data = [...records];

  if (orderBy && orderBy.length) {
    data = doSort(data, [...orderBy], columns);
  }
  if (groupBy && groupBy.length) {
    data = doGroup(data, [...groupBy], columns);
  }
  return doIndexing({
    data: [...data],
    columns,
    rows,
  });
};

export function doAggregate(
  data: any[] = [],
  field: GridColumn
): number | string {
  if (!field || !field.name || !field.aggregate) return 0;
  const flatData = data.map(x => {
    if (x.type === ROW_TYPE.GROUP_ROW) {
      return doAggregate(x.data, field);
    }
    return field.aggregate === 'count' ? 1 : x[field.name] || 0;
  });
  switch (field.aggregate) {
    case 'count':
    case 'sum':
    case 'avg':
      const total = flatData.reduce((total, val) => total + Number(val), 0);
      return Number(
        field.aggregate === 'avg' && flatData.length
          ? Math.round(total / flatData.length)
          : total
      ).toFixed(2);
    case 'min':
      return Math.min(...flatData);
    case 'max':
      return Math.max(...flatData);
    default:
      return 0;
  }
}

export function doSort(
  data: any[],
  sorts: GridSortColumn[],
  columns: GridColumn[] = []
) {
  if (!sorts) return data;
  return data.sort((obj1, obj2) => {
    for (let i = 0; i < sorts.length; i++) {
      const { name, order: by } = sorts[i];
      const isDesc = by === 'desc';
      const field = columns.find(col => col.name === name);
      const formatter = (data: any) =>
        field && field.formatter ? field.formatter(data, field) : data[name];
      const value1 = formatter(obj1);
      const value2 = formatter(obj2);
      if (value1 < value2) return isDesc ? 1 : -1;
      if (value1 > value2) return isDesc ? -1 : 1;
    }
    return 0;
  });
}

export function doGroup(
  data: any[],
  groups: GridGroup[],
  columns: GridColumn[] = [],
  level = 1
) {
  const group = (groups || []).shift();
  if (!group) return data;
  const { name } = group;
  const fieldInfo = columns.find(x => x.name === name) || ({} as GridColumn);
  const groupData: any = {};
  data.forEach(record => {
    const key = fieldInfo.formatter
      ? fieldInfo.formatter(record, fieldInfo)
      : record[name];
    let target = groupData[key] || {
      data: [],
      type: ROW_TYPE.GROUP_ROW,
      level,
      title: fieldInfo.title,
      column: name,
      value: key,
      original: record[fieldInfo.name],
    };
    target.data.push(record);
    groupData[key] = target;
  });
  if (groups.length) {
    Object.keys(groupData).forEach(k => {
      groupData[k].data = doGroup(
        groupData[k].data,
        [...groups],
        columns,
        level + 1
      );
    });
  }
  return Object.values(groupData);
}

export function doIndexing(
  {
    data,
    columns = [],
    rows = [],
  }: {
    data: any[];
    rows: GridRow[];
    columns: GridColumn[];
  },
  parent = null,
  defaultState = 'open'
): any[] {
  const newData = [];
  const hasAggregation = columns.some(x => x.aggregate);
  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    const isGroupRecord =
      record.type === ROW_TYPE.GROUP_ROW && Array.isArray(record.data);
    if (isGroupRecord) {
      const { data, ...groupRecord } = record;
      const aggregate: any = {};
      groupRecord.id = `${parent ? `${parent}_` : ''}${groupRecord.column}_${
        groupRecord.value
      }_${groupRecord.level}`;
      const parentId = groupRecord.id;
      hasAggregation &&
        columns
          .filter(x => x.aggregate)
          .forEach(field => {
            aggregate[field.name] = doAggregate(record.data, field);
          });

      // header row
      newData.push({
        parent,
        key: parentId,
        state: (rows.find(x => x.key === parentId) || {}).state || defaultState,
        type: ROW_TYPE.GROUP_ROW,
        aggregate,
        record: { ...groupRecord, total: data.length },
      });
      // child rows
      newData.push(
        ...doIndexing({ columns, data, rows }, parentId, defaultState)
      );
      // footer row
      hasAggregation &&
        newData.push({
          key: `footer_${parentId}`,
          type: ROW_TYPE.FOOTER_ROW,
          parent: groupRecord.id,
          aggregate,
          record: { ...groupRecord, id: `footer_${parentId}` },
        });
    } else {
      newData.push({
        key: record.id || `ind_${i}`,
        type: ROW_TYPE.ROW,
        record,
        parent,
      });
    }
  }
  return newData;
}

export const navigator = (
  rows: GridRow[],
  {
    maxRow,
    isGroupCell,
    updateRowState,
  }: {
    maxRow: number;
    isGroupCell: boolean;
    updateRowState: (row: any, state: 'open' | 'close') => void;
  }
) => ({
  findNextVisibleRow: (row: number) => {
    for (let i = row + 1; i <= maxRow; i++) {
      if (isRowVisible(rows, rows[i])) return i;
    }
    return row;
  },
  findLastVisibleRow: (row: number) => {
    for (let i = row - 1; i >= 0; i--) {
      if (isRowVisible(rows, rows[i])) return i;
    }
    return row;
  },
  findAndShowPrevRows: (row: number) => {
    for (let i = row - 1; i >= 0; i--) {
      const record = rows[i];
      if (record.type === ROW_TYPE.ROW) {
        if (!isRowVisible(rows, record)) {
          const findRow = (key: string) => rows.find((x: any) => x.key === key);
          let parent = record.parent;
          while (parent) {
            const row = findRow(parent);
            updateRowState(row, 'open');
            parent = row && row.parent;
          }
        }
        return i;
      }
    }
    return row;
  },
  findAndShowNextRows: (row: number) => {
    for (let i = row + (isGroupCell ? 0 : 1); i <= maxRow; i++) {
      switch (rows[i].type) {
        case ROW_TYPE.ROW:
          return i;
        case ROW_TYPE.GROUP_ROW:
          updateRowState(i, 'open');
          break;
      }
    }
    return row;
  },
});

export const noop = () => {};

export const identity = (value: any) => value;

export function capitalizeWord(word: string) {
  return (word[0] || '').toUpperCase() + (word || '').substring(1);
}

export function useRTL() {
  const { dir } = useTheme();
  return dir === 'rtl';
}
