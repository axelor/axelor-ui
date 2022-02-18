/**
 * @title Searching
 */
import React from 'react';
import { Box, Input } from '@axelor-ui/core';
import { Grid } from '../grid';
import { GridProvider } from '../grid-provider';
import { GridColumn } from '../types';
import { isRowCheck } from '../utils';
import { columns, records as records_data } from './demo-data';
import useGridState from './useGridState';

const SearchContext = React.createContext({});

function SearchRow(props: any) {
  return <div {...props} />;
}

function SearchColumn({ column }: { column: GridColumn }) {
  const { onSearch }: any = React.useContext(SearchContext);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === 13) {
      e.preventDefault();
      onSearch && onSearch(column, (e.target as HTMLInputElement).value);
    }
  }

  return !isRowCheck(column) ? (
    <Input placeholder={column.title} onKeyDown={handleKeyDown} />
  ) : null;
}

export default function Searching() {
  const [records, setRecords] = React.useState([...records_data]);
  const [state, setState] = useGridState();

  const onSearch = React.useCallback(
    (column: GridColumn, value: string) => {
      if (value) {
        setRecords(
          records_data.filter((record: any) =>
            ((record[column.name] as string) || '')
              .toString()
              .toLowerCase()
              .includes(`${value}`.toLowerCase())
          )
        );
      } else {
        setRecords([...records_data]);
      }
    },
    [setRecords]
  );

  return (
    <GridProvider>
      <Box>
        <SearchContext.Provider
          value={React.useMemo(() => ({ onSearch }), [onSearch])}
        >
          <Grid
            allowSearch
            allowSelection
            allowCellSelection
            allowCheckboxSelection
            searchRowRenderer={SearchRow}
            searchColumnRenderer={SearchColumn}
            records={records}
            columns={columns}
            state={state}
            setState={setState}
          />
        </SearchContext.Provider>
      </Box>
    </GridProvider>
  );
}
