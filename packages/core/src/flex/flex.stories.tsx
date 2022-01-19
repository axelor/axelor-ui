import { Box } from '../box/box';

export default {
  component: Box,
  title: 'Layout/Flex',
};

const Container = (props: any) => (
  <Box {...props} border p={2} display="flex" gap={8} />
);

const Cell = (props: any) => <Box {...props} border p={2} />;

export const Basic = () => {
  return (
    <Container>
      <Cell>Item 1</Cell>
      <Cell>Item 2</Cell>
      <Cell>Item 3</Cell>
      <Cell>Item 4</Cell>
    </Container>
  );
};

export const Direction = () => {
  return (
    <Container flexDirection="column">
      <Container flexDirection="row">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
      </Container>
      <Container flexDirection="row-reverse">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
      </Container>
      <Container flexDirection="column" alignItems="flex-start">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
      </Container>
      <Container flexDirection="column-reverse" alignItems="flex-start">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
      </Container>
    </Container>
  );
};

export const Wrap = () => {
  return (
    <Container flexDirection="column" style={{ width: 300 }}>
      <Container flexWrap="nowrap">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
        <Cell>Item 5</Cell>
        <Cell>Item 6</Cell>
      </Container>
      <Container flexWrap="wrap">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
        <Cell>Item 5</Cell>
        <Cell>Item 6</Cell>
      </Container>
      <Container flexWrap="wrap-reverse">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
        <Cell>Item 5</Cell>
        <Cell>Item 6</Cell>
      </Container>
    </Container>
  );
};

export const JustifyContent = () => {
  return (
    <Container flexDirection="column">
      <Container justifyContent="flex-start">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
      </Container>
      <Container justifyContent="flex-end">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
      </Container>
      <Container justifyContent="center">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
      </Container>
      <Container justifyContent="space-between">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
      </Container>
      <Container justifyContent="space-around">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
      </Container>
      <Container justifyContent="space-evenly">
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
      </Container>
    </Container>
  );
};

export const AlignItems = () => {
  return (
    <Container flexDirection="column">
      <Container alignItems="flex-start" style={{ height: 100 }}>
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
      </Container>
      <Container alignItems="flex-end" style={{ height: 100 }}>
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
      </Container>
      <Container alignItems="center" style={{ height: 100 }}>
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
      </Container>
      <Container alignItems="stretch" style={{ height: 100 }}>
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
      </Container>
      <Container alignItems="baseline" style={{ height: 100 }}>
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
      </Container>
    </Container>
  );
};

export const AlignContent = () => {
  return (
    <Container flexDirection="column">
      <Container
        flexWrap="wrap"
        alignContent="flex-start"
        style={{ width: 380, height: 200 }}
      >
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
        <Cell>Item 5</Cell>
        <Cell>Item 6</Cell>
        <Cell>Item 7</Cell>
      </Container>
      <Container
        flexWrap="wrap"
        alignContent="flex-end"
        style={{ width: 380, height: 200 }}
      >
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
        <Cell>Item 5</Cell>
        <Cell>Item 6</Cell>
        <Cell>Item 7</Cell>
      </Container>
      <Container
        flexWrap="wrap"
        alignContent="center"
        style={{ width: 380, height: 200 }}
      >
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
        <Cell>Item 5</Cell>
        <Cell>Item 6</Cell>
        <Cell>Item 7</Cell>
      </Container>
      <Container
        flexWrap="wrap"
        alignContent="space-between"
        style={{ width: 380, height: 200 }}
      >
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
        <Cell>Item 5</Cell>
        <Cell>Item 6</Cell>
        <Cell>Item 7</Cell>
      </Container>
      <Container
        flexWrap="wrap"
        alignContent="space-around"
        style={{ width: 380, height: 200 }}
      >
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
        <Cell>Item 5</Cell>
        <Cell>Item 6</Cell>
        <Cell>Item 7</Cell>
      </Container>
      <Container
        flexWrap="wrap"
        alignContent="space-evenly"
        style={{ width: 380, height: 200 }}
      >
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
        <Cell>Item 5</Cell>
        <Cell>Item 6</Cell>
        <Cell>Item 7</Cell>
      </Container>
      <Container
        flexWrap="wrap"
        alignContent="stretch"
        style={{ width: 380, height: 200 }}
      >
        <Cell>Item 1</Cell>
        <Cell>Item 2</Cell>
        <Cell>Item 3</Cell>
        <Cell>Item 4</Cell>
        <Cell>Item 5</Cell>
        <Cell>Item 6</Cell>
        <Cell>Item 7</Cell>
      </Container>
    </Container>
  );
};

export const Order = () => {
  return (
    <Container>
      <Cell order={3}>Item 1</Cell>
      <Cell order={2}>Item 2</Cell>
      <Cell order={1}>Item 3</Cell>
    </Container>
  );
};

export const Grow = () => {
  return (
    <Container>
      <Cell flexGrow={1}>Item 1</Cell>
      <Cell>Item 2</Cell>
      <Cell>Item 3</Cell>
    </Container>
  );
};

export const Shrink = () => {
  return (
    <Container>
      <Cell w={100}>Item 1</Cell>
      <Cell flexShrink={1}>Item 2</Cell>
      <Cell flexShrink={0}>Item 3</Cell>
    </Container>
  );
};

export const AlignSelf = () => {
  return (
    <Container alignItems="flex-start" style={{ height: 150 }}>
      <Cell>Item 1</Cell>
      <Cell alignSelf="flex-end">Item 2</Cell>
      <Cell>Item 3</Cell>
    </Container>
  );
};
