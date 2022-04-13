/**
 * @title Editable
 */
import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Tree } from '../tree';
import { Input } from '../../input';
import { useClassNames } from '../../styles';

const columns = [
  { name: 'title', title: 'Title', type: 'String' },
  { name: 'progress', title: 'Progress', type: 'String' },
];

const records = [
  {
    id: 1,
    title: 'Project 1',
    _children: true,
    tasks: [
      { id: 101, title: 'Analysis', progress: 0 },
      { id: 102, title: 'Definition', progress: 50 },
      { id: 103, title: 'Presale analysis', progress: 10 },
      { id: 104, title: 'Test', progress: 20 },
    ],
  },
  {
    id: 2,
    title: 'Project 2',
    _children: true,
    tasks: [
      { id: 105, title: 'Design', progress: 5 },
      { id: 106, title: 'Development', progress: 50 },
      { id: 107, title: 'Follow-up', progress: 30 },
      { id: 108, title: 'Implementation', progress: 20 },
      { id: 109, title: 'Research', progress: 90 },
      { id: 110, title: 'UI Design', progress: 45 },
    ],
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
        <select className={classNames('form-control')} {...props}>
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

function Form({ node, index, columns, onSave, onCancel }: any) {
  const values = React.useRef({ ...node.data });
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
    return (
      onSave &&
      onSave(
        {
          ...node,
          data,
        },
        index
      )
    );
  }, [onSave, index, node]);

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
          value={node.data[column.name]}
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
    return new Promise(resolve => {
      const project = records.find(p => p.id === record.id);

      setTimeout(() => {
        resolve(project?.tasks || []);
      }, 0);
    });
  }, []);

  const onUpdate = React.useCallback(record => {
    return record;
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Tree
        columns={columns}
        records={records}
        editNodeRenderer={Form}
        onLoad={onLoad}
        onNodeMove={onUpdate}
      />
    </DndProvider>
  );
};
