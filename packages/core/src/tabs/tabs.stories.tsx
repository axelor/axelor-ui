import React from 'react';

import { Icon } from '../icon';
import { Box } from '../box';
import { Tabs } from '../tabs';

export default {
  component: Tabs,
  title: 'Components/Tabs',
};

function Tab({
  title,
  index,
  active,
  onClick,
  ...rest
}: {
  title: string;
  index?: number;
  active?: boolean;
  onClick?: (e: React.SyntheticEvent, index?: number) => void;
}) {
  return (
    <Box
      p={2}
      d="flex"
      justifyContent="center"
      borderStart
      style={{
        minWidth: 120,
        cursor: 'pointer',
        background: active ? '#ddd' : '#fff',
      }}
      onClick={e => onClick && onClick(e, index)}
      {...rest}
    >
      {title}
    </Box>
  );
}

function TabPanel({
  index,
  value,
  children,
}: {
  index: number;
  value: number;
  children: React.ReactChild;
}): any {
  return index === value ? children : null;
}

const tabs = new Array(20)
  .fill(0)
  .map((_, ind) => ({ title: ` Tab ${ind + 1} ` }));

export const Basic = () => {
  const [active, setActive] = React.useState(0);
  return (
    <Box border>
      <Tabs value={active} onTabChange={setActive}>
        {tabs.map((item: any, ind) => (
          <Tab key={ind} title={item.title} />
        ))}
      </Tabs>
      {tabs.map((item, ind) => (
        <TabPanel key={ind} value={active} index={ind}>
          <Box p={3} border>
            <Box as="h3">Tab content of {item.title}</Box>
          </Box>
        </TabPanel>
      ))}
    </Box>
  );
};

export const ScrollButtons = () => {
  const [active, setActive] = React.useState(0);
  return (
    <Box border>
      <Tabs
        scrollLeft={
          <Box d="flex" justifyContent="center" alignItems="center" px={2}>
            <Icon use="arrow-left-circle" />
          </Box>
        }
        scrollRight={
          <Box d="flex" justifyContent="center" alignItems="center" px={2}>
            <Icon use="arrow-right-circle" />
          </Box>
        }
        value={active}
        onTabChange={setActive}
      >
        {tabs.map((item: any, ind) => (
          <Tab key={ind} title={item.title} />
        ))}
      </Tabs>
      {tabs.map((item, ind) => (
        <TabPanel key={ind} value={active} index={ind}>
          <Box p={3} border>
            <Box as="h3">Tab content of {item.title}</Box>
          </Box>
        </TabPanel>
      ))}
    </Box>
  );
};
