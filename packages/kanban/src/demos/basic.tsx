/**
 * @title Basic
 */

import React, { useState, useCallback } from 'react';

import Kanban, { KanbanProps } from '../kanban';
import { getDefaultColumns } from './data';
import { CardEvent, Column, ColumnEvent } from '../types';

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function reorderCards<T extends Column>({
  columns,
  sourceColumn,
  destinationColumn,
  sourceIndex,
  destinationIndex,
}: {
  columns: T[];
  sourceColumn: T;
  destinationColumn: T;
  sourceIndex: number;
  destinationIndex: number;
}): T[] {
  const getColumnIndex = (columnId: Column['id']) =>
    columns.findIndex(c => String(c.id) === String(columnId));

  const getRecords = (columnId: Column['id']) => [
    ...(columns.find(c => String(c.id) === String(columnId))!.records || []),
  ];

  const current = getRecords(sourceColumn.id);
  const next = getRecords(destinationColumn.id);
  const target = current[sourceIndex];

  // moving to same list
  if (sourceColumn.id === destinationColumn.id) {
    const reordered = reorder(current, sourceIndex, destinationIndex);
    const newColumns = columns.map(c => ({ ...c }));
    newColumns[getColumnIndex(sourceColumn.id)].records = reordered;
    return newColumns;
  }

  // moving to different list
  current.splice(sourceIndex, 1);
  next.splice(destinationIndex, 0, target);
  const newColumns = columns.map(c => ({ ...c }));
  newColumns[getColumnIndex(sourceColumn.id)].records = current;
  newColumns[getColumnIndex(destinationColumn.id)].records = next;
  return newColumns;
}

export function WithContainer() {
  return function ({ columns: columnsProp, readonly }: KanbanProps) {
    const [columns, setColumns] = useState<Column[]>(
      columnsProp || getDefaultColumns()
    );

    const getColumnIndex = useCallback(
      columnId => columns.findIndex(c => String(c.id) === String(columnId)),
      [columns]
    );

    const getRecordIndex = useCallback(
      (recordId, columnId) =>
        columns[getColumnIndex(columnId)]?.records?.findIndex(
          r => String(r.id) === String(recordId)
        ),
      [columns, getColumnIndex]
    );

    const onCardMove = useCallback(
      ({ column, index, source, record }: CardEvent) => {
        const updatedColumns = reorderCards({
          columns,
          destinationColumn: column,
          destinationIndex: index,
          sourceColumn: source,
          sourceIndex: getRecordIndex(record.id, source!.id) as number,
        });

        setColumns(updatedColumns);
      },
      [columns, getRecordIndex]
    );

    const onColumnMove = useCallback(
      ({ column, index }: ColumnEvent) => {
        const updatedColumns = reorder(
          columns,
          getColumnIndex(column.id),
          index
        );
        setColumns(updatedColumns);
      },
      [columns, getColumnIndex]
    );

    return (
      <Kanban
        columns={columns}
        readonly={readonly}
        onCardMove={onCardMove}
        onColumnMove={onColumnMove}
      />
    );
  };
}

export default WithContainer();
