/**
 * @title Scrollable Vertical (start/end)
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

function TabStart(props: any) {
  return (
    <Box d="flex" justifyContent="center" alignItems="center" px={2}>
      <Icon use="chevron-up" {...props} />
    </Box>
  );
}

function TabEnd(props: any) {
  return (
    <Box d="flex" justifyContent="center" alignItems="center" px={2}>
      <Icon use="chevron-down" {...props} />
    </Box>
  );
}

export default () => {
  return (
    <OverflowList
      d="flex"
      flexDirection="column"
      scrollable
      scrollButtonStart={props => <TabStart {...props} />}
      scrollButtonEnd={props => <TabEnd {...props} />}
      vertical
      style={{ maxHeight: 290, width: 200 }}
    >
      {() =>
        new Array(20)
          .fill(0)
          .map((_, ind) => <Tab key={ind} title={` Tab ${ind + 1} `} />)
      }
    </OverflowList>
  );
};
