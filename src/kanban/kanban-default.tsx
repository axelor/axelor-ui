import { Box } from '../core';

import styles from './kanban.module.css';
import { ColumnRenderer, RecordRenderer } from './types';

export const DefaultColumn: ColumnRenderer = ({
  column,
  readonly,
  RecordList,
}) => {
  return (
    <Box p={2} bg="light" border rounded me={2} className={styles.column}>
      <Box as="h5" p={2}>
        {column.title}
      </Box>
      <RecordList
        column={column}
        readonly={readonly}
        className={styles['record-list']}
      />
    </Box>
  );
};

export const DefaultRecord: RecordRenderer = ({ record }) => {
  return (
    <Box p={2} mt={2} shadow="sm" rounded className={styles.record}>
      <Box as="p" pb={1} pt={1}>
        {record.title}
      </Box>
    </Box>
  );
};
