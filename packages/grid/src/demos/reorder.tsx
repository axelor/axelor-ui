/**
 * @title Row Reorder
 */
import { Grid } from '../grid';
import { GridProvider } from '../grid-provider';
import { columns, records } from '../demos/demo-data';
import useGridState from './useGridState';

export default function Reorder() {
  const [state, setState] = useGridState();

  return (
    <GridProvider>
      <Grid
        allowSelection
        allowCheckboxSelection
        allowRowReorder
        selectionType="multiple"
        records={records}
        columns={columns}
        state={state}
        setState={setState}
      />
    </GridProvider>
  );
}
