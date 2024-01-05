/**
 * @title Editable
 */
import React from "react";
import { Box, Button, FocusTrap, Input, useClassNames } from "../../core";
import { Grid } from "../grid";
import { GridProvider } from "../grid-provider";
import { columns, records } from "./demo-data";
import useGridState from "./useGridState";
import { GridRow } from "../types";

const FormHandlers = React.createContext(React.createRef<any>());

const FormContext = React.createContext({
  onFocus: (index: number) => {},
  onChange: (name: string, value: any) => {},
  onSave: (editSave?: boolean) => {},
  onCancel: (data?: any, index?: number) => {},
});

function saveRecordAPI(record: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!record.name) {
        resolve(null);
      } else {
        resolve({ ...record, id: record.id || Date.now() });
      }
    }, 300);
  });
}

function Form({
  style,
  className,
  children,
  onSave,
  onCancel,
  index,
  data,
}: any) {
  const values = React.useRef({ ...data.record });
  const handlers = React.useContext(FormHandlers);
  const dirty = React.useRef(!data.record.id);
  const currentFocus = React.useRef<number>();

  const handleChange = React.useCallback((name: string, value: any) => {
    dirty.current = true;
    values.current = {
      ...values.current,
      [name]: value,
    };
  }, []);

  const handleFocus = React.useCallback((fieldIndex: number) => {
    currentFocus.current = fieldIndex;
  }, []);

  const handleCancel = React.useCallback(() => {
    onCancel && onCancel(values.current, index, currentFocus.current);
  }, [onCancel, index]);

  const handleSave = React.useCallback(
    (isSaveFromEdit?: boolean) => {
      const data = values.current;
      return (
        onSave &&
        onSave(
          data,
          index,
          currentFocus.current,
          dirty.current,
          isSaveFromEdit === true,
        )
      );
    },
    [onSave, index],
  );

  React.useEffect(() => {
    const _handlers = handlers;
    _handlers.current && (_handlers.current.save = handleSave);
    return () => {
      _handlers.current && (_handlers.current.save = null);
    };
  }, [handlers, handleSave]);

  return (
    <FormContext.Provider
      value={React.useMemo(
        () => ({
          onCancel: handleCancel,
          onFocus: handleFocus,
          onChange: handleChange,
          onSave: handleSave,
        }),
        [handleSave, handleChange, handleFocus, handleCancel],
      )}
    >
      <FocusTrap>
        <div {...{ style, className, children }} />
      </FocusTrap>
    </FormContext.Provider>
  );
}

function FormField({ children, style, className, ...rest }: any) {
  const { data, focus, value: _value } = rest;
  const { onFocus, onSave, onChange, onCancel } = React.useContext(FormContext);
  const { name = "", type = "", options } = data || {};
  const [value, setValue] = React.useState(_value === undefined ? "" : _value);
  const initRef = React.useRef(false);
  const classNames = useClassNames();
  function handleKeyDown(e: any) {
    if (e.defaultPrevented) return;
    if (e.keyCode === 27 && onCancel) {
      return onCancel(data, rest.index);
    }
    if (e.keyCode === 13 && onSave) {
      return onSave();
    }
  }

  function render() {
    const props = {
      autoFocus: focus,
      value,
      onFocus: () => onFocus && onFocus(rest.index),
      onChange: (e: any) => setValue(e.target.value),
      onKeyDown: handleKeyDown,
    };
    if (options) {
      return (
        <select className={classNames("form-control")} {...props}>
          <option value="">Select</option>
          {options.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }
    if (type === "String") {
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

export default function Editable() {
  const [$records, setRecords] = React.useState(records);
  const [state, setState] = useGridState();
  const boxRef = React.useRef<any>();
  const handlers = React.useRef({
    save: (e: boolean) => {},
  });

  const handleRecordAdd = React.useCallback(() => {
    setRecords((records) => [...records, {}] as any);
  }, []);

  const handleRecordEdit = React.useCallback(
    async (record: GridRow["record"]) => {
      const { save } = handlers.current || {};
      if (save) {
        return await save(true);
      }
    },
    [],
  );

  const handleRecordSave = React.useCallback(
    (record: GridRow["record"], index: number) => {
      boxRef.current.style.opacity = "0.5";
      return saveRecordAPI(record).then((record: any) => {
        if (record) {
          setRecords((records) =>
            records.map((_record, i) =>
              (_record.id ? _record.id === record.id : i === index)
                ? record
                : _record,
            ),
          );
        }
        boxRef.current.style.opacity = null;
        return record;
      });
    },
    [],
  );

  const handleRecordDiscard = React.useCallback(
    (record: GridRow["record"], rowIndex: number) => {
      if (!record.id) {
        setRecords((records) => records.filter((record, i) => i !== rowIndex));
      }
    },
    [],
  );

  return (
    <GridProvider>
      <FormHandlers.Provider value={handlers}>
        <Box ref={boxRef} style={{ display: "flex" }}>
          <Grid
            editable
            allowColumnResize
            allowGrouping
            allowSorting
            allowSelection
            allowCheckboxSelection
            allowCellSelection
            sortType="state"
            addNewText={<Button variant="link">Add new line...</Button>}
            selectionType="multiple"
            records={$records}
            columns={columns}
            state={state}
            setState={setState}
            editRowRenderer={Form}
            editRowColumnRenderer={FormField}
            onRecordAdd={handleRecordAdd}
            onRecordEdit={handleRecordEdit}
            onRecordSave={handleRecordSave}
            onRecordDiscard={handleRecordDiscard}
          />
        </Box>
      </FormHandlers.Provider>
    </GridProvider>
  );
}
