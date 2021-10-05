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

const FormHandlers = React.createContext(React.createRef<any>());

const FormContext = React.createContext({
  onChange: (name: string, value: any) => {},
  onSave: () => {},
  onCancel: (data?: any, index?: number) => {},
});

function saveRecordAPI(record: any) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (!record.name) {
        resolve(null);
      } else {
        resolve(record);
      }
    }, 1000);
  });
}

function Form({ style, className, children, onSave, onCancel, data }: any) {
  const values = React.useRef({ ...data.record });
  const handlers = React.useContext(FormHandlers);
  const dirty = React.useRef(false);

  const handleChange = React.useCallback((name, value) => {
    dirty.current = true;
    values.current = {
      ...values.current,
      [name]: value,
    };
  }, []);

  const handleSave = React.useCallback(() => {
    const data = values.current;
    if (!dirty.current) {
      return data;
    }
    return onSave && onSave(data);
  }, [onSave]);

  React.useEffect(() => {
    handlers.current && (handlers.current.save = handleSave);
  }, [handlers, handleSave]);

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
  const initRef = React.useRef(false);

  function handleKeyDown(e: any) {
    if (e.keyCode === 27) {
      return onCancel && onCancel(data, rest.index);
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
    initRef.current && onChange && onChange(name, value);
    initRef.current = true;
  }, [onChange, name, value]);

  return <div {...{ style, className }}>{render()}</div>;
}

export default function () {
  const [$records, setRecords] = React.useState(records);
  const [state, setState] = React.useState<GridState>({
    columns: [],
    rows: [],
  });
  const boxRef = React.useRef<any>();
  const handlers = React.useRef({
    save: () => {},
  });

  const handleRecordEdit = React.useCallback(async record => {
    const { save } = handlers.current || {};
    if (save) {
      return await save();
    }
  }, []);

  const handleRecordSave = React.useCallback(record => {
    boxRef.current.style.opacity = '0.5';
    return saveRecordAPI(record).then((record: any) => {
      if (record) {
        setRecords(records =>
          records.map(_record => (_record.id === record.id ? record : _record))
        );
      }
      boxRef.current.style.opacity = null;
      return record;
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <FormHandlers.Provider value={handlers}>
        <Box ref={boxRef} style={{ display: 'flex', maxHeight: 500 }}>
          <Grid
            editable
            allowColumnResize
            allowGrouping
            allowSorting
            allowSelection
            allowCheckboxSelection
            allowCellSelection
            sortType="state"
            groupingText={'Drag columns here...'}
            selectionType="multiple"
            records={$records}
            columns={columns}
            state={state}
            setState={setState}
            editRowRenderer={Form}
            editRowColumnRenderer={FormField}
            onRecordEdit={handleRecordEdit}
            onRecordSave={handleRecordSave}
          />
        </Box>
      </FormHandlers.Provider>
    </DndProvider>
  );
}
