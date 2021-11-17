import React from 'react';
import styles from '../styles/example.module.css';

import { Box } from '../box';

export default {
  component: Box,
  title: 'Layout/Flex',
};

const ExampleBox = ({ alignContent, mb = 3 }: any) => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example} mb={mb}>
      <Box
        d="flex"
        alignContent={alignContent}
        flexWrap
        className={highlight}
        style={{ height: 200, width: 800 }}
      >
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
    </Box>
  );
};

export const AlignContent = () => {
  return (
    <Box>
      <ExampleBox alignContent="start" />
      <ExampleBox alignContent="end" />
      <ExampleBox alignContent="center" />
      <ExampleBox alignContent="space-between" />
      <ExampleBox alignContent="space-around" mb={0} />
    </Box>
  );
};

export const AlignItems = () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box
        d="flex"
        style={{ height: 100 }}
        alignItems="start"
        mb={3}
        className={highlight}
      >
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box
        d="flex"
        style={{ height: 100 }}
        alignItems="end"
        mb={3}
        className={highlight}
      >
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box
        d="flex"
        style={{ height: 100 }}
        alignItems="center"
        mb={3}
        className={highlight}
      >
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box
        d="flex"
        style={{ height: 100 }}
        alignItems="baseline"
        mb={3}
        className={highlight}
      >
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box
        d="flex"
        style={{ height: 100 }}
        alignItems="stretch"
        className={highlight}
      >
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
    </Box>
  );
};

export const AlignSelf = () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box d="flex" mb={3} className={highlight} style={{ height: 100 }}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box alignSelf="start" p={2} className={highlight}>
          Aligned flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" mb={3} className={highlight} style={{ height: 100 }}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box alignSelf="end" p={2} className={highlight}>
          Aligned flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" mb={3} className={highlight} style={{ height: 100 }}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box alignSelf="center" p={2} className={highlight}>
          Aligned flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" mb={3} className={highlight} style={{ height: 100 }}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box alignSelf="baseline" p={2} className={highlight}>
          Aligned flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" className={highlight} style={{ height: 100 }}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box alignSelf="stretch" p={2} className={highlight}>
          Aligned flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
    </Box>
  );
};

export const AutoMargins = () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box d="flex" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>

      <Box d="flex" mb={3} className={highlight}>
        <Box me="auto" p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>

      <Box d="flex" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box ms="auto" p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
    </Box>
  );
};

export const Fill = () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box d="flex" className={example}>
      <Box p={2} flexFill className={highlight}>
        Flex item with a lot of content
      </Box>
      <Box p={2} flexFill className={highlight}>
        Flex item
      </Box>
      <Box p={2} flexFill className={highlight}>
        Flex item
      </Box>
    </Box>
  );
};

export const FlexDirection = () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box d="flex" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item 1
        </Box>
        <Box p={2} className={highlight}>
          Flex item 2
        </Box>
        <Box p={2} className={highlight}>
          Flex item 3
        </Box>
      </Box>
      <Box d="flex" flexDirection="row-reverse" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item 1
        </Box>
        <Box p={2} className={highlight}>
          Flex item 2
        </Box>
        <Box p={2} className={highlight}>
          Flex item 3
        </Box>
      </Box>
      <Box d="flex" flexDirection="column" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item 1
        </Box>
        <Box p={2} className={highlight}>
          Flex item 2
        </Box>
        <Box p={2} className={highlight}>
          Flex item 3
        </Box>
      </Box>
      <Box d="flex" flexDirection="column-reverse" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item 1
        </Box>
        <Box p={2} className={highlight}>
          Flex item 2
        </Box>
        <Box p={2} className={highlight}>
          Flex item 3
        </Box>
      </Box>
    </Box>
  );
};

export const GrowShrink = () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box d="flex" mb={2} className={highlight}>
        <Box p={2} flexGrow={1} className={highlight}>
          Flex grow
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Third flex item
        </Box>
      </Box>
      <Box d="flex" className={highlight}>
        <Box p={2} w={100} className={highlight}>
          Flex Item
        </Box>
        <Box p={2} flexShrink={1} className={highlight}>
          Flex Shrink
        </Box>
      </Box>
    </Box>
  );
};

export const JustifyContent = () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box d="flex" justifyContent="start" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" justifyContent="end" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" justifyContent="center" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" justifyContent="space-between" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" justifyContent="space-around" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" justifyContent="space-evenly" className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
    </Box>
  );
};

export const Order = () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box d="flex" className={highlight}>
        <Box order={3} p={2} className={highlight}>
          First flex item
        </Box>
        <Box order={2} p={2} className={highlight}>
          Second flex item
        </Box>
        <Box order={1} p={2} className={highlight}>
          Third flex item
        </Box>
      </Box>
    </Box>
  );
};

export const Wrap = () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box
        d="flex"
        mb={3}
        flexWrap={false}
        className={highlight}
        style={{ width: '8rem' }}
      >
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" mb={3} flexWrap className={highlight} w={50}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" flexWrap="reverse" className={highlight} w={50}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
    </Box>
  );
};
