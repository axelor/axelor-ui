/**
 * @title Readonly Column
 */
import Basic from './basic';
import { getId, getRecords } from './data';

function ReadonlyColumnDemo() {
  return (
    <Basic
      columns={[
        {
          id: getId(),
          title: 'Todo',
          records: getRecords(3),
        },
        {
          id: getId(),
          title: 'In-progress',
          records: getRecords(3),
        },
        {
          id: getId(),
          title: 'Completed (readonly)',
          readonly: true,
          records: getRecords(3),
        },
      ]}
    />
  );
}

export default ReadonlyColumnDemo;
