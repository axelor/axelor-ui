/**
 * @title Sorting
 */
import { Box } from '../../core';
import { Grid } from '../grid';
import { columns, records } from './demo-data';
import useGridState from './useGridState';

export default function Sorting() {
  const [state, setState] = useGridState({
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
}
