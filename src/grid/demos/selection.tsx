/**
 * @title Selection
 */
import { Box } from '../../core';
import { Grid } from '../grid';
import { GridProvider } from '../grid-provider';
import { columns, records } from './demo-data';
import useGridState from './useGridState';

export default function Selection({
  singleSelection,
}: {
  singleSelection: boolean;
}) {
  const [state, setState] = useGridState();

  return (
    <GridProvider>
      <Box>
        <Grid
          allowSelection
          allowCheckboxSelection
          allowCellSelection
          selectionType={singleSelection ? 'single' : 'multiple'}
          records={records}
          columns={columns}
          state={state}
          setState={setState}
        />
      </Box>
    </GridProvider>
  );
}
