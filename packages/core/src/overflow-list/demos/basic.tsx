/**
 * @title Basic
 */
import { Icon, OverflowList, Box } from '@axelor-ui/core';

function Tab({ title }: any) {
  return (
    <Box
      p={2}
      d="flex"
      justifyContent="center"
      border
      style={{ minWidth: 120 }}
    >
      {title}
    </Box>
  );
}

export default () => {
  return (
    <OverflowList
      d="flex"
      scrollable
    >
      {() =>
        new Array(20)
          .fill(0)
          .map((_, ind) => <Tab key={ind} title={` Tab ${ind + 1} `} />)
      }
    </OverflowList>
  );
};
