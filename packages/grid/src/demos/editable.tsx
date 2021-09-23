/**
 * @title Editable
 */
import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Box, Input } from '@axelor-ui/core';
import { styleNames } from '@axelor-ui/core/styles';
import { Grid } from '../grid';
import { GridState } from '../types';

import { columns, records } from './demo-data';

const FormContext = React.createContext({
  onChange: (name: string, value: any) => {},
  onSave: () => {},
  onCancel: () => {},
});

function Form({ style, className, children, onSave, onCancel, data }: any) {
  const values = React.useRef({ ...data.record });

  const handleChange = React.useCallback((name, value) => {
    values.current = {
      ...values.current,
      [name]: value,
    };
  }, []);

  const handleSave = React.useCallback(() => {
    onSave && onSave(values.current);
  }, []);

  return (
    <FormContext.Provider
      value={React.useMemo(
        () => ({
          onCancel,
          onChange: handleChange,
          onSave: handleSave,
        }),
        [handleSave, handleChange, onCancel]
      )}
    >
      <div {...{ style, className, children }} />
    </FormContext.Provider>
  );
}

function FormField({ children, style, className, ...rest }: any) {
  const { data, focus, value: _value } = rest;
  const { onSave, onChange, onCancel } = React.useContext(FormContext);
  const { name = '', type = '', options } = data || {};
  const [value, setValue] = React.useState(_value);

  function handleKeyDown(e: any) {
    if (e.keyCode === 27) {
      return onCancel && onCancel();
    }
    if (e.ctrlKey && e.keyCode === 13) {
      return onSave && onSave();
    }
  }

  function render() {
    const props = {
      autoFocus: focus,
      value,
      onChange: (e: any) => setValue(e.target.value),
      onKeyDown: handleKeyDown,
    };
    if (options) {
      return (
        <select className={styleNames('form-control')} {...props}>
          <option value="">Select</option>
          {options.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }
    if (type === 'String') {
      return <Input type="text" {...props} />;
    }
    return null;
  }

  React.useEffect(() => {
    onChange && onChange(name, value);
  }, [onChange, name, value]);

  return <div {...{ style, className }}>{render()}</div>;
}

export default function () {
  const [$records, setRecords] = React.useState(records);
  const [state, setState] = React.useState<GridState>({
    columns: [],
    rows: [],
  });

  const handleRecordSave = React.useCallback(record => {
    setRecords(records =>
      records.map(_record => (_record.id === record.id ? record : _record))
    );
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box style={{ display: 'flex', maxHeight: 500 }}>
        <Grid
          editable
          allowSelection
          allowCheckboxSelection
          allowCellSelection
          selectionType="multiple"
          records={$records}
          columns={columns}
          state={state}
          setState={setState}
          onRecordSave={handleRecordSave}
          editRowRenderer={Form}
          editRowColumnRenderer={FormField}
        />
      </Box>
    </DndProvider>
  );
}
