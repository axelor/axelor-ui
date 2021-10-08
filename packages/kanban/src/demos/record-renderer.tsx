/**
 * @title Record Renderer
 */
import React from 'react';
import { Box } from '@axelor-ui/core';
import { RecordRenderer } from '../types';

import Basic from './basic';
import { getId, getRecords, getTitle } from './data';

const Record: RecordRenderer = ({ record, column }) => {
  return (
    <Box p={2} mt={2} shadow="sm" rounded bg="primary" color="white">
      <Box as="p" pb={1} pt={1}>
        {record.title}
      </Box>
    </Box>
  );
};

function RecordRendererDemo() {
  return (
    <Basic
      columns={[
        {
          id: getId(),
          title: 'Todo',
          records: [{ id: getId(), title: getTitle(), renderer: Record }],
        },
      ]}
    />
  );
}

export default RecordRendererDemo;
