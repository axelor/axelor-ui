import React from 'react';
import { ReactComponent as BiChevronLeft } from 'bootstrap-icons/icons/chevron-left.svg';
import { ReactComponent as BiChevronRight } from 'bootstrap-icons/icons/chevron-right.svg';
import { ReactComponent as BiChevronUp } from 'bootstrap-icons/icons/chevron-up.svg';
import { ReactComponent as BiChevronDown } from 'bootstrap-icons/icons/chevron-down.svg';
import { ReactComponent as BiThreeDots } from 'bootstrap-icons/icons/three-dots.svg';

import { Box } from '../box';
import { Button } from '../button';
import { ButtonGroup } from '../button-group';
import { Icon } from '../icon';
import { OverflowList } from './overflow-list';

export default {
  component: OverflowList,
  title: 'Core/OverflowList',
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

export const Dropdown = ({ inverse = false, vertical = false }) => {
  const items = new Array(10)
    .fill(0)
    .map((_, ind) => ({ title: ` Item ${ind + 1} ` }));

  return (
    <OverflowList
      d="flex"
      vertical={vertical}
      inverse={inverse}
      items={items}
      as={ButtonGroup}
      renderListItem={(item: any, index) => (
        <Button
          border
          variant="light"
          style={{ minWidth: 120, whiteSpace: 'nowrap' }}
          key={index}
        >
          {item.title}
        </Button>
      )}
      renderOverflowItem={(item: any, index, onClick: any) => (
        <Box key={index} onClick={onClick}>
          {item.title}
        </Box>
      )}
      renderButton={(type, props: any) => {
        if (type === 'scroll-left') {
          return (
            <Box
              d="flex"
              style={{ justifyContent: 'center' }}
              alignItems="center"
              px={2}
            >
              <Icon as={BiChevronLeft} {...props} />
            </Box>
          );
        }
        if (type === 'scroll-right') {
          return (
            <Box d="flex" justifyContent="center" alignItems="center" px={2}>
              <Icon as={BiChevronRight} {...props} />
            </Box>
          );
        }
        if (type === 'dropdown') {
          return (
            <Button
              variant="light"
              border
              {...props}
              d="flex"
              justifyContent="center"
              alignItems="center"
              px={2}
            >
              <span>
                <Icon as={BiThreeDots} />
              </span>
            </Button>
          );
        }
        return null;
      }}
    />
  );
};

export const DropdownVertical = () => {
  return (
    <Box d="flex" p={1} style={{ height: '25vh' }}>
      <Dropdown vertical />
    </Box>
  );
};

export const DropdownInverse = () => {
  return <Dropdown inverse />;
};

export const DropdownVerticalInverse = () => {
  return (
    <Box d="flex" style={{ height: '25vh' }}>
      <Dropdown vertical inverse />
    </Box>
  );
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
              <Icon as={BiChevronLeft} {...props} />
            </Box>
          );
        }
        if (type === 'scroll-right') {
          return (
            <Box d="flex" justifyContent="center" alignItems="center" px={2}>
              <Icon as={BiChevronRight} {...props} />
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
      style={{ maxHeight: 380, width: 200 }}
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
              <Icon as={BiChevronUp} {...props} />
            </Box>
          );
        }
        if (type === 'scroll-right') {
          return (
            <Box d="flex" justifyContent="center" alignItems="center" px={2}>
              <Icon as={BiChevronDown} {...props} />
            </Box>
          );
        }
        return null;
      }}
    />
  );
};
