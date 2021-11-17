/**
 * @title Dropdown
 */
import React from 'react';

import { Box } from '../box';
import { Icon } from '../icon';
import { OverflowList } from './overflow-list';

export default {
  component: OverflowList,
  title: 'Core/OverflowList',
};

function Tab({ title, ...rest }: any) {
  return (
    <Box
      p={2}
      d="flex"
      justifyContent="center"
      border
      style={{ minWidth: 120, cursor: 'pointer' }}
      {...rest}
    >
      {title}
    </Box>
  );
}

function DropdownMenu({ children }: any) {
  return <Box>{children}</Box>;
}

const DropdownButton = (props: any) => {
  return (
    <Box {...props} d="flex" justifyContent="center" alignItems="center" px={2}>
      <Icon use="three-dots" />
    </Box>
  );
};

export const Basic = () => {
  return (
    <OverflowList d="flex" scrollable>
      {() =>
        new Array(20)
          .fill(0)
          .map((_, ind) => <Tab key={ind} title={` Tab ${ind + 1} `} />)
      }
    </OverflowList>
  );
};

export const Dropdown = ({ inverse = false }) => {
  return (
    <OverflowList
      inverse={inverse}
      d="flex"
      dropdown={props => <DropdownMenu {...props} />}
      dropdownButton={props => <DropdownButton {...props} />}
    >
      {({ closeOverflowPopup }) =>
        new Array(10)
          .fill(0)
          .map((_, ind) => (
            <Tab
              key={ind}
              onClick={closeOverflowPopup}
              title={` Tab ${ind + 1} `}
            />
          ))
      }
    </OverflowList>
  );
};

export const DropdownInverse = () => {
  return <Dropdown inverse={true} />;
};

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

export const Scroll = () => {
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

export const ScrollVertical = () => {
  return (
    <OverflowList
      d="flex"
      flexDirection="column"
      scrollable
      scrollButtonStart={props => <TabStart {...props} use="chevron-up" />}
      scrollButtonEnd={props => <TabEnd {...props} use="chevron-down" />}
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
