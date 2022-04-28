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
import { OverflowListItemProps, OverflowListButtonType } from './types';

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
      renderListItem={(item: OverflowListItemProps, index: number) => (
        <Button
          border
          variant="light"
          style={{ minWidth: 120, whiteSpace: 'nowrap' }}
          key={index}
        >
          {item.title}
        </Button>
      )}
      renderOverflowItem={(
        item: OverflowListItemProps,
        index: number,
        closeDropdown?: () => void
      ) => {
        return (
          <Box key={index} onClick={() => closeDropdown && closeDropdown()}>
            {item.title}
          </Box>
        );
      }}
      renderButton={(type: OverflowListButtonType, props: any) => {
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

export const Scroll = (arg: any, { globals: { direction } }: any) => {
  const items = new Array(20)
    .fill(0)
    .map((_, ind) => ({ title: ` Tab ${ind + 1} ` }));

  const rtl = direction === 'rtl';

  return (
    <OverflowList
      d="flex"
      scrollable
      items={items}
      renderList={(items: OverflowListItemProps[]) =>
        items.map((item, ind) => <Tab key={ind} title={item.title} />)
      }
      renderButton={(type: OverflowListButtonType, props: any) => {
        if (type === 'scroll-left') {
          return (
            <Box
              d="flex"
              justifyContent="center"
              alignItems="center"
              px={2}
              {...props}
            >
              <Icon as={rtl ? BiChevronRight : BiChevronLeft} />
            </Box>
          );
        }
        if (type === 'scroll-right') {
          return (
            <Box
              d="flex"
              justifyContent="center"
              alignItems="center"
              px={2}
              {...props}
            >
              <Icon as={rtl ? BiChevronLeft : BiChevronRight} />
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
    <Box style={{ width: 200 }}>
      <OverflowList
        d="flex"
        flexDirection="column"
        style={{ maxHeight: 380 }}
        scrollable
        vertical
        items={items}
        renderList={(items: OverflowListItemProps[]) =>
          items.map((item, ind) => <Tab key={ind} title={item.title} />)
        }
        renderButton={(type: OverflowListButtonType, props: any) => {
          if (type === 'scroll-left') {
            return (
              <Box
                d="flex"
                justifyContent="center"
                alignItems="center"
                px={2}
                {...props}
              >
                <Icon as={BiChevronUp} />
              </Box>
            );
          }
          if (type === 'scroll-right') {
            return (
              <Box
                d="flex"
                justifyContent="center"
                alignItems="center"
                px={2}
                {...props}
              >
                <Icon as={BiChevronDown} />
              </Box>
            );
          }
          return null;
        }}
      />
    </Box>
  );
};
