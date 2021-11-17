import React from 'react';

import { Box } from '../box';
import { BoxProps } from '../box/box';

export default {
  component: Box,
  title: 'Core/Grid',
};

const Container = (props: BoxProps) => <Box {...props} display="grid" />;
const Cell = (props: BoxProps) => <Box {...props} border p={2} />;

export const Basic = () => {
  return (
    <Container
      gridTemplateColumns="150px 150px 150px"
      gridTemplateRows="150px 150px"
      gridGap={2}
    >
      <Cell></Cell>
      <Cell></Cell>
      <Cell></Cell>
      <Cell></Cell>
      <Cell></Cell>
      <Cell></Cell>
    </Container>
  );
};

export const Fraction = () => {
  return (
    <Container
      gridTemplateColumns="repeat(3, 1fr)"
      gridTemplateRows="repeat(2, 150px)"
      gridGap={2}
    >
      <Cell></Cell>
      <Cell></Cell>
      <Cell></Cell>
      <Cell></Cell>
      <Cell></Cell>
      <Cell></Cell>
    </Container>
  );
};

export const Position = () => {
  return (
    <Container
      gridTemplateColumns="repeat(3, 150px)"
      gridTemplateRows="repeat(2, 150px)"
      gridGap={2}
    >
      <Cell gridRow="2/3" gridColumn="2/3">
        Item 1
      </Cell>
      <Cell>Item 2</Cell>
      <Cell>Item 3</Cell>
      <Cell>Item 4</Cell>
      <Cell>Item 5</Cell>
      <Cell>Item 6</Cell>
    </Container>
  );
};

export const Layout = () => {
  return (
    <Container
      style={{ width: 750, height: 600 }}
      gridTemplateColumns="200px 1fr 1fr"
      gridTemplateRows="80px 1fr 1fr 100px"
      gridGap="1rem"
    >
      <Cell gridRow="1/2" gridColumn="1/4">
        header
      </Cell>
      <Cell gridRow="2/4" gridColumn="1/2">
        sidebar
      </Cell>
      <Cell gridRow="2/3" gridColumn="2/4">
        Content-1
      </Cell>
      <Cell gridRow="3/4" gridColumn="2/3">
        Content-2
      </Cell>
      <Cell gridRow="3/4" gridColumn="3/4">
        Content-3
      </Cell>
      <Cell gridRow="4/5" gridColumn="1/4">
        footer
      </Cell>
    </Container>
  );
};

export const Areas = () => {
  return (
    <Container
      style={{ width: 750, height: 600 }}
      gridTemplateColumns="200px 1fr 1fr"
      gridTemplateRows="80px 1fr 1fr 100px"
      gridGap="1rem"
      gridTemplateAreas={`
      "header header header"
      "sidebar content-1 content-1"
      "sidebar content-2 content-3"
      "footer footer footer"`}
    >
      <Cell gridArea="header">header</Cell>
      <Cell gridArea="sidebar">sidebar</Cell>
      <Cell gridArea="content-1">Content-1</Cell>
      <Cell gridArea="content-2">Content-2</Cell>
      <Cell gridArea="content-3">Content-3</Cell>
      <Cell gridArea="footer">footer</Cell>
    </Container>
  );
};
