/**
 * @title Aggregation
 */
import { Box } from '@axelor-ui/core';
import { Grid } from '../grid';
import { GridProvider } from '../grid-provider';
import { records } from './demo-data';
import useGridState from './useGridState';

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

export default function Aggregation() {
  const [state, setState] = useGridState({
    groupBy: [{ name: 'category' }],
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
