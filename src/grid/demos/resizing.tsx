/**
 * @title Resizing
 */
import { Box } from '../../core';
import { Grid } from '../grid';
import { GridProvider } from '../grid-provider';
import { columns, records } from './demo-data';
import useGridState from './useGridState';

export default function Resizing() {
  const [state, setState] = useGridState({
    columns: [],
    rows: [],
  });

  return (
    <GridProvider>
      <Box>
        <Grid
          allowColumnResize
          records={records}
          columns={columns}
          state={state}
          setState={setState}
        />
      </Box>
    </GridProvider>
  );
}
