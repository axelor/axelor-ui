/**
 * @title Editable
 */
import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Tree, Input } from '@axelor-ui/core';
import { styleNames } from '@axelor-ui/core/styles';

const columns = [
  { name: 'name', title: 'Name', type: 'String' },
  { name: 'code', title: 'Code' },
];

const records = [
  {
    id: 1,
    name: 'Storage',
    _children: true,
  },
  {
    id: 2,
    name: 'Computers',
    _children: true,
  },
  {
    id: 3,
    name: 'Accessories',
    _children: true,
  },
  {
    id: 4,
    name: 'Other',
    _children: true,
  },
];

const FormHandlers = React.createContext(React.createRef<any>());

function FormField({
  className,
  data,
  index,
  focus,
  value: _value,
  onSave,
  onChange,
  onCancel,
}: any) {
  const { name = '', type = '', options } = data || {};
  const [value, setValue] = React.useState(_value);
  const initRef = React.useRef(false);

  function handleKeyDown(e: any) {
    if (e.keyCode === 27) {
      return onCancel && onCancel(data, index);
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

  return <div {...{ style: { flex: 1 }, className }}>{render()}</div>;
}

function Form({ data, index, columns, onSave, onCancel }: any) {
  const values = React.useRef({ ...data });
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
    return onSave && onSave(data, index);
  }, [onSave, index]);

  React.useEffect(() => {
    handlers.current && (handlers.current.save = handleSave);
  }, [handlers, handleSave]);

  return (
    <div style={{ display: 'flex' }}>
      {columns.map((column: any, index: number) => (
        <FormField
          focus={index === 0}
          key={column.name}
          data={column}
          value={data[column.name]}
          onCancel={onCancel}
          onChange={handleChange}
          onSave={handleSave}
        />
      ))}
    </div>
  );
}

export default () => {
  const onLoad = React.useCallback(async record => {
    return new Array(4).fill(0).map((_, index) => ({
      id: record.id * 100 + index,
      name: `${record.name} Item ${index + 1}`,
    }));
  }, []);

  const onUpdate = React.useCallback(record => {
    return record;
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Tree
        columns={columns}
        data={records}
        editNodeRenderer={Form}
        onLoad={onLoad}
        onNodeMove={onUpdate}
      />
    </DndProvider>
  );
};
