/**
 * @title Sortable
 */
import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Tree } from '../tree';

const columns = [
  { name: 'title', title: 'Title', type: 'String' },
  { name: 'progress', title: 'Progress' },
];

const records = [
  {
    id: 1,
    title: 'Project 1',
    progress: 40,
    _children: true,
    tasks: [
      { id: 101, title: 'Analysis', progress: 0 },
      { id: 102, title: 'Definition', progress: 50 },
      { id: 103, title: 'Presale analysis', progress: 10 },
      { id: 104, title: 'Test', progress: 20 },
    ],
  },
  {
    id: 2,
    title: 'Project 2',
    progress: 60,
    _children: true,
    tasks: [
      { id: 105, title: 'Design', progress: 5 },
      { id: 106, title: 'Development', progress: 50 },
      { id: 107, title: 'Follow-up', progress: 30 },
      { id: 108, title: 'Implementation', progress: 20 },
      { id: 109, title: 'Research', progress: 90 },
      { id: 110, title: 'UI Design', progress: 45 },
    ],
  },
];

export default () => {
  const onLoad = React.useCallback(async record => {
    return new Promise(resolve => {
      const project = records.find(p => p.id === record.id);

      setTimeout(() => {
        resolve(project?.tasks || []);
      }, 100);
    });
  }, []);

  const onNodeMove = React.useCallback((record, newParent) => {
    return { ...record, category: newParent.name };
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Tree
        sortable
        columns={columns}
        records={records}
        onLoad={onLoad}
        onNodeMove={onNodeMove}
      />
    </DndProvider>
  );
};
