/**
 * @title Resizing
 */
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import React from 'react';
import { Box } from '@axelor-ui/core';
import { Grid } from '../grid';
import { GridState } from '../types';

import { columns, records } from './demo-data';

export default function () {
  const [state, setState] = React.useState<GridState>({
    columns: [],
    rows: [],
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        <Grid
          allowColumnResize
          records={records}
          columns={columns}
          state={state}
          setState={setState}
        />
      </Box>
    </DndProvider>
  );
}
