/**
 * @title Aggregation
 */
import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Box } from '@axelor-ui/core';
import { Grid } from '../grid';
import { GridState } from '../types';

import { records } from './demo-data';

const columns = [
  { name: 'name', title: 'Name', type: 'String' },
  {
    name: 'category',
    title: 'Category',
    type: 'String',
    options: ['Storage', 'Computer', 'Other'],
  },
  { name: 'color', title: 'Color', type: 'String' },
  {
    name: 'price',
    title: 'Price',
    type: 'String',
    aggregate: 'avg',
  },
];

export default function () {
  const [state, setState] = React.useState<GridState>({
    columns: [],
    rows: [],
    groupBy: [{ name: 'category' }],
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        <Grid
          allowGrouping
          allowSorting
          sortType="state"
          groupingText={'Drag columns here...'}
          records={records}
          columns={columns}
          state={state}
          setState={setState}
        />
      </Box>
    </DndProvider>
  );
}
