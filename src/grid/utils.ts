import { useTheme } from "../core";

import {
  GridColumn,
  GridGroup,
  GridProps,
  GridRow,
  GridSortColumn,
} from "./types";

export const GRID_CONFIG = {
  COLUMN_MIN_WIDTH: 100,
};

export const ROW_TYPE = {
  GROUP_ROW: "group-row",
  FOOTER_ROW: "footer-row",
  ROW: "row",
};

export const isRowVisible = (rows: GridRow[], { parent }: any): boolean => {
  if (!parent) return true;
  const row = rows.find((x) => x.key === parent);
  return (row || {}).state === "open" && isRowVisible(rows, row);
};

export const isRowCheck = (column: GridColumn) => column.type === "row-checked";
export const isRowExpand = (column: GridColumn) => column.type === "row-expand";

/**
 * Retrieves the raw value of a given record's column. It uses {@link GridColumn.valueGetter}
 * if provided; otherwise, it directly retrieves the value from the record.
 *
 * @param {GridRow["record"]} record - The record object that contains the column value.
 * @param {GridColumn} column - The column to extract from the record object.
 * @return {*} The raw value of the specified column from the provided record.
 */
function getRawValue(record: GridRow["record"], column: GridColumn) {
  return column.valueGetter
    ? column.valueGetter(column, record)
    : record?.[column.name];
}

/**
 * Retrieves the formatted value of a given record's column. It uses {@link GridColumn.formatter}
 * if provided; otherwise, it returns the raw value.
 *
 * @param {GridRow["record"]} record - The record object that contains the column value.
 * @param {GridColumn} column -The column to extract from the record object.
 * @return {*} The formatted value  of the specified column from the provided record.
 */
function getFormattedValue(record: GridRow["record"], column: GridColumn) {
  const value = getRawValue(record, column);
  return column.formatter ? column.formatter(column, value, record) : value;
}

export const getRows = ({
  columns,
  orderBy,
  groupBy,
  records,
  rows,
  sortFn,
}: {
  columns: GridColumn[];
  orderBy: undefined | null | GridSortColumn[];
  groupBy: undefined | null | GridGroup[];
  records: any[];
  rows: GridRow[];
  sortFn?: GridProps["sortHandler"];
}) => {
  let data = [...records];

  if (orderBy && orderBy.length) {
    data = sortFn
      ? sortFn(data, [...orderBy], columns)
      : doSort(data, [...orderBy], columns);
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

export function getColumnWidth(
  column: GridColumn,
  value?: number,
  isResize = false,
) {
  return Math.max(
    GRID_CONFIG.COLUMN_MIN_WIDTH,
    isResize ? 0 : column.width || 0,
    column.minWidth || 0,
    value || 0,
  );
}

/**
 * Determines the scale (number of decimal places) of a given value.
 *
 * @param {number|string} value - The numeric value to evaluate. Can be a number or a string representation of a number.
 * @return {number} The count of decimal places. Returns 0 if the value has no decimal part.
 */
export function getNumberScale(value: number | string): number {
  const parts = value.toString().split(".");
  return parts[1] ? parts[1].length : 0;
}

/**
 * Processes hierarchical data and flattens it into a single array based on the specified field.
 *
 * @param {any[]} data - The array of data to be flattened.
 * @param {GridColumn} field - The field used to extract raw values from each data entry.
 * @return {any[]} An array containing the flattened data.
 */
function getFlatData(data: any[] = [], field: GridColumn): any[] {
  return data
    .map((x) => {
      if (x.type === ROW_TYPE.GROUP_ROW) {
        return getFlatData(x.data, field);
      }
      return getRawValue(x, field) || 0;
    })
    .flatMap((element) => element);
}

export function doAggregate(
  data: any[] = [],
  field: GridColumn,
): number | null {
  if (!field || !field.name || !field.aggregate) return null;

  const flatData = getFlatData(data, field);

  switch (field.aggregate) {
    case "count":
      return flatData.length;
    case "sum":
    case "avg": {
      const total = flatData.reduce(
        (_total: number, val) => _total + Number(val),
        0,
      );
      const aggregateValue = Number(
        field.aggregate === "avg" && flatData.length
          ? total / flatData.length
          : total,
      );
      return Number(
        aggregateValue.toFixed(Math.max(...flatData.map(getNumberScale))),
      );
    }
    case "min":
      return Math.min(...flatData);
    case "max":
      return Math.max(...flatData);
    default:
      return null;
  }
}

function doSort(
  data: any[],
  sorts: GridSortColumn[],
  columns: GridColumn[] = [],
) {
  if (!sorts) return data;
  return data.sort((obj1, obj2) => {
    for (let i = 0; i < sorts.length; i++) {
      const { name, order: by } = sorts[i];
      const isDesc = by === "desc";
      const field = columns.find((col) => col.name === name);
      const isNumber =
        field &&
        field.type &&
        ["decimal", "integer", "long"].includes(field.type);

      const getValue = (rec: GridRow["record"]) =>
        isNumber
          ? Number(getRawValue(rec, field ?? { name }) || 0)
          : getFormattedValue(rec, field ?? { name });

      const value1 = getValue(obj1);
      const value2 = getValue(obj2);

      if (value1 < value2) return isDesc ? 1 : -1;
      if (value1 > value2) return isDesc ? -1 : 1;
    }
    return 0;
  });
}

function doGroup(
  data: any[],
  groups: GridGroup[],
  columns: GridColumn[] = [],
  level = 1,
) {
  const group = (groups || []).shift();
  if (!group) return data;
  const { name } = group;
  const fieldInfo = columns.find((x) => x.name === name) || ({} as GridColumn);
  const groupData: Record<string, any> = {};

  data.forEach((record) => {
    const key = getFormattedValue(record, fieldInfo) || "";
    const target = groupData[key] || {
      data: [],
      type: ROW_TYPE.GROUP_ROW,
      level,
      title: fieldInfo.title,
      column: name,
      value: key,
      original: getRawValue(record, fieldInfo),
    };
    target.data!.push(record);
    target.total = (target.total ?? 0) + 1;
    groupData[key] = target;
  });

  const groupKeys = Object.keys(groupData).sort((v1, v2) => {
    if (v2.length === 0) return -1;
    return 0;
  });

  if (groups.length) {
    groupKeys.forEach((k) => {
      groupData[k].data = doGroup(
        groupData[k].data!,
        [...groups],
        columns,
        level + 1,
      );
    });
  }
  return groupKeys.map((k) => groupData[k]);
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
  defaultState = "open",
): GridRow[] {
  const newData = [];
  const hasAggregation = columns.some((x) => x.aggregate);
  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    const isGroupRecord =
      record.type === ROW_TYPE.GROUP_ROW && Array.isArray(record.data);
    if (isGroupRecord) {
      const aggregate: Record<string, number> = {};
      const { data: groupData, ...groupRecord } = record;
      groupRecord.id = `${parent ? `${parent}_` : ""}${groupRecord.column}_${
        groupRecord.value
      }_${groupRecord.level}`;
      const parentId = groupRecord.id;

      if (hasAggregation) {
        columns
          .filter((x) => x.aggregate)
          .forEach((field) => {
            const aggregateValue = doAggregate(groupData, field);
            if (aggregateValue !== null) {
              aggregate[field.name] = aggregateValue;
            }
          });
      }

      // header row
      newData.push({
        parent,
        key: parentId,
        state:
          (rows.find((x) => x.key === parentId) || {}).state || defaultState,
        type: ROW_TYPE.GROUP_ROW,
        aggregate,
        record: groupRecord,
      });

      // child rows
      newData.push(
        ...doIndexing(
          { columns, data: groupData, rows },
          parentId,
          defaultState,
        ),
      );

      // footer row
      if (hasAggregation) {
        newData.push({
          key: `footer_${parentId}`,
          type: ROW_TYPE.FOOTER_ROW,
          parent: groupRecord.id,
          aggregate,
          record: { ...groupRecord, id: `footer_${parentId}` },
        });
      }
    } else {
      newData.push({
        key: record.id || `ind_${i}`,
        type: ROW_TYPE.ROW,
        record,
        parent,
      });
    }
  }
  return newData as GridRow[];
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
    updateRowState: (row: any, state: "open" | "close") => void;
  },
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
            updateRowState(row, "open");
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
          updateRowState(i, "open");
          break;
      }
    }
    return row;
  },
});

export const noop = () => {};

export const identity = (value: any) => value;

export function capitalizeWord(word: string) {
  return (word[0] || "").toUpperCase() + (word || "").substring(1);
}

export function useRTL() {
  const { dir } = useTheme();
  return dir === "rtl";
}
