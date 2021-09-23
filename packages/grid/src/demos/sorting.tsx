/**
 * @title Sorting
 */

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
    <Box>
      <Grid
        allowSorting
        sortType="state"
        records={records}
        columns={columns}
        state={state}
        setState={setState}
      />
    </Box>
  );
  // return null;
}
