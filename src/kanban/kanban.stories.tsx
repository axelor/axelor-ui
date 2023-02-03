import { useState, useCallback } from 'react';
import { Box, Input, Button, Icon, Menu, MenuItem } from '../core';
import { ReactComponent as BiCaretDownFill } from 'bootstrap-icons/icons/caret-down-fill.svg';

import { Kanban, KanbanProps } from './kanban';
import { CardEvent, Column, ColumnEvent } from './types';

const config = {
  component: Kanban,
  title: 'Advance/Kanban',
};

const getId = (() => {
  let id = 0;
  return () => id++;
})();

const getTitle = (() => {
  let id = 0;
  return () => `Title ${id++}`;
})();

function getRecords(count: number) {
  return Array.from({ length: count }, () => ({
    id: getId(),
    title: getTitle(),
  }));
}

function getDefaultColumns() {
  return ['Todo', 'In-Progress', 'Completed'].map(title => ({
    id: getId(),
    title,
    records: getRecords(5),
  }));
}

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

function KanbanContainer({ columns: columnsProp, readonly }: KanbanProps) {
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
      const updatedColumns = reorder(columns, getColumnIndex(column.id), index);
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
}

export const Basic = () => <KanbanContainer />;

export const ColumnEditor = () => (
  <KanbanContainer
    columns={[
      {
        id: getId(),
        title: 'Todo',
        records: getRecords(3),
        renderer: ({ RecordList, column }) => (
          <Box p={2} bg="light" border rounded me={2}>
            <Box as="h5" p={2}>
              {column.title}
            </Box>
            <Box d="flex">
              <Input />
              &nbsp;
              <Button bg="primary" color="white">
                Add
              </Button>
            </Box>
            <RecordList column={column} />
          </Box>
        ),
      },
    ]}
  />
);

export const ColumnRenderer = () => (
  <KanbanContainer
    columns={[
      {
        id: getId(),
        title: 'Todo',
        records: getRecords(3),
        renderer: ({ RecordList, column }) => (
          <Box p={2} bg="primary" border rounded me={2}>
            <Box as="h5" p={2} color="white">
              {column.title}
            </Box>
            <RecordList column={column} />
          </Box>
        ),
      },
    ]}
  />
);

export const ColumnScrollable = () => (
  <KanbanContainer
    columns={[
      {
        id: getId(),
        title: 'Todo',
        records: getRecords(10),
        renderer: ({ RecordList, column }) => (
          <Box border rounded me={2} p={2} bg="light" style={{ width: 250 }}>
            <Box as="h5" p={2}>
              {column.title}
            </Box>
            <RecordList
              column={column}
              style={{ maxHeight: 250, overflow: 'auto' }}
            />
          </Box>
        ),
      },
    ]}
  />
);

export const ReadonlyColumn = () => (
  <KanbanContainer
    columns={[
      {
        id: getId(),
        title: 'Todo',
        records: getRecords(3),
      },
      {
        id: getId(),
        title: 'In-progress',
        records: getRecords(3),
      },
      {
        id: getId(),
        title: 'Completed (readonly)',
        readonly: true,
        records: getRecords(3),
      },
    ]}
  />
);

export const Readonly = () => <KanbanContainer readonly />;

const Record = ({ record, column, onEdit, onDelete }: any) => {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);

  const toggle = () => setOpen(v => !v);

  const closeMenu = () => setOpen(false);

  const handleEdit = () => {
    onEdit && onEdit({ column, record });
    setOpen(false);
  };
  const handleDelete = () => {
    onDelete && onDelete({ column, record });
    setOpen(false);
  };

  return (
    <Box p={2} mt={2} shadow="sm" rounded style={{ backgroundColor: 'white' }}>
      <Box pb={1} pt={1} d="flex" justifyContent="space-between">
        <Box as="p">{record.title}</Box>
        <Box>
          <Button p={0} ref={setTargetEl} onClick={toggle} d="inline-flex">
            <Icon as={BiCaretDownFill} />
          </Button>
        </Box>
        <Menu show={open} target={targetEl} onHide={closeMenu}>
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export const RecordMenu = () => {
  const onEdit = useCallback(() => alert('edit'), []);
  const onDelete = useCallback(() => alert('delete'), []);

  return (
    <KanbanContainer
      columns={[
        {
          id: getId(),
          title: 'Todo',
          records: [
            {
              id: getId(),
              title: getTitle(),
              renderer: props => (
                <Record {...props} {...{ onEdit, onDelete }} />
              ),
            },
          ],
        },
      ]}
    />
  );
};

export const RecordRenderer = () => (
  <KanbanContainer
    columns={[
      {
        id: getId(),
        title: 'Todo',
        records: [
          {
            id: getId(),
            title: getTitle(),
            renderer: ({ record, column }) => {
              return (
                <Box
                  p={2}
                  mt={2}
                  shadow="sm"
                  rounded
                  bg="primary"
                  color="white"
                >
                  <Box as="p" pb={1} pt={1}>
                    {record.title}
                  </Box>
                </Box>
              );
            },
          },
        ],
      },
    ]}
  />
);

export default config;
