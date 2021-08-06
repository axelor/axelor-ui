/**
 * @title Dropdown
 */
import React from 'react';
import { Icon, OverflowList, Box } from '@axelor-ui/core';

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

function Dropdown({ children }: any) {
  return <Box>{children}</Box>;
}

const DropdownButton = (props: any) => {
  return (
    <Box {...props} d="flex" justifyContent="center" alignItems="center" px={2}>
      <Icon use="three-dots" />
    </Box>
  );
};

export default () => {
  return (
    <OverflowList
      d="flex"
      dropdown={props => <Dropdown {...props} />}
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
