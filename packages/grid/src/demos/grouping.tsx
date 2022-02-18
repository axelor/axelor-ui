/**
 * @title Grouping
 */
import { Box } from '@axelor-ui/core';
import { Grid } from '../grid';
import { GridProvider } from '../grid-provider';
import { columns, records } from './demo-data';
import useGridState from './useGridState';

export default function Grouping() {
  const [state, setState] = useGridState({
    groupBy: [{ name: 'category' }, { name: 'color' }],
  });

  return (
    <GridProvider>
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
    </GridProvider>
  );
}
