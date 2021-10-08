/**
 * @title Column Editor
 */
import React from 'react';
import { Box, Input, Button } from '@axelor-ui/core';
import { ColumnRenderer } from '../types';

import Basic from './basic';
import { getId, getRecords } from './data';

const Column: ColumnRenderer = ({ RecordList, column }) => {
  return (
    <Box p={2} bg="white" border rounded me={2}>
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
  );
};

function ColumnRendererDemo() {
  return (
    <Basic
      columns={[
        {
          id: getId(),
          title: 'Todo',
          records: getRecords(3),
          renderer: Column,
        },
      ]}
    />
  );
}

export default ColumnRendererDemo;
