/**
 * @title Custom Renderer
 */
import { Box } from '@axelor-ui/core';
import { Grid } from '../grid';
import { columns, records } from './demo-data';
import useGridState from './useGridState';

function CustomRowRenderer({ className, children }: any) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        padding: 4,
        margin: 4,
        float: 'left',
        width: 240,
      }}
      {...{ className, children }}
    />
  );
}

function CustomCellRenderer({ className, style, data, children }: any) {
  return (
    <div
      className={className}
      style={{
        ...style,
        minWidth: null,
        width: null,
        border: 'none',
      }}
    >
      {data.title} : {children}
    </div>
  );
}

function CustomHeaderRenderer() {
  return null;
}

export default function Renderer() {
  const [state, setState] = useGridState();

  return (
    <Box>
      <Grid
        records={records}
        columns={columns}
        state={state}
        setState={setState}
        headerRowRenderer={CustomHeaderRenderer}
        rowRenderer={CustomRowRenderer}
        cellRenderer={CustomCellRenderer}
      />
    </Box>
  );
}
