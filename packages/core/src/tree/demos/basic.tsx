/**
 * @title Basic
 */
import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Tree } from '@axelor-ui/core';

const columns = [
  { name: 'name', title: 'Name', type: 'String' },
  { name: 'code', title: 'Code'}
];

const records = [
  {
    id: 1,
    name: 'Storage',
    _children: true,
  },
  {
    id: 2,
    name: 'Computers',
    _children: true,
  },
  {
    id: 3,
    name: 'Accessories',
    _children: true,
  },
  {
    id: 4,
    name: 'Other',
    _children: true,
  },
];

export default () => {
  const onLoad = React.useCallback(async record => {
    return new Array(4).fill(0).map((_, index) => ({
      id: record.id * 100 + index,
      name: `${record.name} Item ${index + 1}`,
    }));
  }, []);
  const onUpdate = React.useCallback(record => {
    return record;
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Tree
        columns={columns}
        data={records}
        onUpdate={onUpdate}
        onLoad={onLoad}
      />
    </DndProvider>
  );
};
