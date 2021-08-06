/**
 * @title Scrollable (start/end)
 */
import React from 'react';
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
      <Icon use="chevron-left" {...props} />
    </Box>
  );
}

function TabEnd(props: any) {
  return (
    <Box d="flex" justifyContent="center" alignItems="center" px={2}>
      <Icon use="chevron-right" {...props} />
    </Box>
  );
}

export default () => {
  return (
    <OverflowList
      d="flex"
      scrollable
      scrollButtonStart={props => <TabStart {...props} />}
      scrollButtonEnd={props => <TabEnd {...props} />}
    >
      {() =>
        new Array(20)
          .fill(0)
          .map((_, ind) => <Tab key={ind} title={` Tab ${ind + 1} `} />)
      }
    </OverflowList>
  );
};
