import { Box } from "../core";
import { findDataProp, makeTestId } from "../core/system/utils";
import { ColumnRenderer, RecordRenderer } from "./types";

import styles from "./kanban.module.css";

export const DefaultColumn: ColumnRenderer = (props) => {
  const { column, readonly, RecordList } = props;
  const testId = findDataProp(props, "data-testid");
  return (
    <Box
      p={2}
      bg="body-tertiary"
      border
      rounded
      me={2}
      className={styles.column}
      data-testid={testId}
    >
      <Box as="h5" p={2} data-testid={makeTestId(testId, "title")}>
        {column.title}
      </Box>
      <RecordList
        column={column}
        readonly={readonly}
        className={styles["record-list"]}
        data-testid={makeTestId(testId, "cards")}
      />
    </Box>
  );
};

export const DefaultRecord: RecordRenderer = (props) => {
  const { record } = props;
  const testId = findDataProp(props, "data-testid");
  return (
    <Box
      p={2}
      mt={2}
      shadow="sm"
      rounded
      className={styles.record}
      data-testid={testId}
    >
      <Box as="p" pb={1} pt={1} data-testid={makeTestId(testId, "title")}>
        {record.title}
      </Box>
    </Box>
  );
};
