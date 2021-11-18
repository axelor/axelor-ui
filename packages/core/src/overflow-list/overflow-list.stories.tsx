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

export const Basic = () => {
  const items = new Array(20)
    .fill(0)
    .map((_, ind) => ({ title: ` Tab ${ind + 1} ` }));

  return <OverflowList d="flex" scrollable items={items} />;
};

function Tab({ title, ...rest }: { title: string }) {
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

export const Dropdown = ({ inverse = false }) => {
  const items = new Array(10)
    .fill(0)
    .map((_, ind) => ({ title: ` Tab ${ind + 1} ` }));

  return (
    <OverflowList
      d="flex"
      inverse={inverse}
      items={items}
      renderListItem={(item: any) => (
        <Tab key={item.title} title={item.title} />
      )}
      renderOverflowItem={(item: any, onClick: any) => (
        <Tab key={item.title} title={item.title} onClick={onClick} />
      )}
      renderButton={(type, props: any) => {
        if (type === 'scroll-left') {
          return (
            <Box d="flex" justifyContent="center" alignItems="center" px={2}>
              <Icon use="chevron-left" {...props} />
            </Box>
          );
        }
        if (type === 'scroll-right') {
          return (
            <Box d="flex" justifyContent="center" alignItems="center" px={2}>
              <Icon use="chevron-right" {...props} />
            </Box>
          );
        }
        if (type === 'dropdown') {
          return (
            <Box
              {...props}
              d="flex"
              justifyContent="center"
              alignItems="center"
              px={2}
            >
              <Icon use="three-dots" />
            </Box>
          );
        }
        return null;
      }}
    />
  );
};

export const DropdownInverse = () => {
  return <Dropdown inverse={true} />;
};

export const Scroll = () => {
  const items = new Array(20)
    .fill(0)
    .map((_, ind) => ({ title: ` Tab ${ind + 1} ` }));

  return (
    <OverflowList
      d="flex"
      scrollable
      items={items}
      renderList={items =>
        items.map((item: any, ind) => <Tab key={ind} title={item.title} />)
      }
      renderButton={(type, props) => {
        if (type === 'scroll-left') {
          return (
            <Box d="flex" justifyContent="center" alignItems="center" px={2}>
              <Icon use="chevron-left" {...props} />
            </Box>
          );
        }
        if (type === 'scroll-right') {
          return (
            <Box d="flex" justifyContent="center" alignItems="center" px={2}>
              <Icon use="chevron-right" {...props} />
            </Box>
          );
        }
        return null;
      }}
    />
  );
};

export const ScrollVertical = () => {
  const items = new Array(20)
    .fill(0)
    .map((_, ind) => ({ title: ` Tab ${ind + 1} ` }));

  return (
    <OverflowList
      d="flex"
      flexDirection="column"
      style={{ maxHeight: 290, width: 200 }}
      scrollable
      vertical
      items={items}
      renderList={items =>
        items.map((item: any, ind) => <Tab key={ind} title={item.title} />)
      }
      renderButton={(type, props) => {
        if (type === 'scroll-left') {
          return (
            <Box d="flex" justifyContent="center" alignItems="center" px={2}>
              <Icon use="chevron-up" {...props} />
            </Box>
          );
        }
        if (type === 'scroll-right') {
          return (
            <Box d="flex" justifyContent="center" alignItems="center" px={2}>
              <Icon use="chevron-down" {...props} />
            </Box>
          );
        }
        return null;
      }}
    />
  );
};
