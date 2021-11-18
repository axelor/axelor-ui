/**
 * @title Column Scrollable
 */
import { Box } from '@axelor-ui/core';
import { ColumnRenderer } from '../types';

import Basic from './basic';
import { getId, getRecords } from './data';

const Column: ColumnRenderer = ({ RecordList, column }) => {
  return (
    <Box border rounded me={2} p={2} bg="light" style={{ width: 250 }}>
      <Box as="h5" p={2}>
        {column.title}
      </Box>
      <RecordList
        column={column}
        style={{ maxHeight: 250, overflow: 'auto' }}
      />
    </Box>
  );
};

function ColumnScrollableDemo() {
  return (
    <Basic
      columns={[
        {
          id: getId(),
          title: 'Todo',
          records: getRecords(10),
          renderer: Column,
        },
      ]}
    />
  );
}

export default ColumnScrollableDemo;
