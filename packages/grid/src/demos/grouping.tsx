/**
 * @title Grouping
 */
import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Box } from '@axelor-ui/core';
import { Grid } from '../grid';
import { GridState } from '../types';

import { columns, records } from './demo-data';

export default function () {
  const [state, setState] = React.useState<GridState>({
    columns: [],
    rows: [],
    groupBy: [{ name: 'category' }, { name: 'color' }],
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
