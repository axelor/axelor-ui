import { useTranslation } from "react-i18next";
import { Box } from "../box/box";

const config = {
  component: Box,
  title: "Layout/Flex",
};

const Container = (props: any) => (
  <Box {...props} border p={2} display="flex" gap={8} />
);

const Cell = (props: any) => <Box {...props} border p={2} />;

export const Basic = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Cell>{t("Item")} 1</Cell>
      <Cell>{t("Item")} 2</Cell>
      <Cell>{t("Item")} 3</Cell>
      <Cell>{t("Item")} 4</Cell>
    </Container>
  );
};

export const Direction = () => {
  const { t } = useTranslation();
  return (
    <Container flexDirection="column">
      <Container flexDirection="row">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
      </Container>
      <Container flexDirection="row-reverse">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
      </Container>
      <Container flexDirection="column" alignItems="flex-start">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
      </Container>
      <Container flexDirection="column-reverse" alignItems="flex-start">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
      </Container>
    </Container>
  );
};

export const Wrap = () => {
  const { t } = useTranslation();
  return (
    <Container flexDirection="column" style={{ width: 300 }}>
      <Container flexWrap="nowrap">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
        <Cell>{t("Item")} 5</Cell>
        <Cell>{t("Item")} 6</Cell>
      </Container>
      <Container flexWrap="wrap">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
        <Cell>{t("Item")} 5</Cell>
        <Cell>{t("Item")} 6</Cell>
      </Container>
      <Container flexWrap="wrap-reverse">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
        <Cell>{t("Item")} 5</Cell>
        <Cell>{t("Item")} 6</Cell>
      </Container>
    </Container>
  );
};

export const JustifyContent = () => {
  const { t } = useTranslation();
  return (
    <Container flexDirection="column">
      <Container justifyContent="flex-start">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
      </Container>
      <Container justifyContent="flex-end">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
      </Container>
      <Container justifyContent="center">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
      </Container>
      <Container justifyContent="space-between">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
      </Container>
      <Container justifyContent="space-around">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
      </Container>
      <Container justifyContent="space-evenly">
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
      </Container>
    </Container>
  );
};

export const AlignItems = () => {
  const { t } = useTranslation();
  return (
    <Container flexDirection="column">
      <Container alignItems="flex-start" style={{ height: 100 }}>
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
      </Container>
      <Container alignItems="flex-end" style={{ height: 100 }}>
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
      </Container>
      <Container alignItems="center" style={{ height: 100 }}>
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
      </Container>
      <Container alignItems="stretch" style={{ height: 100 }}>
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
      </Container>
      <Container alignItems="baseline" style={{ height: 100 }}>
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
      </Container>
    </Container>
  );
};

export const AlignContent = () => {
  const { t } = useTranslation();
  return (
    <Container flexDirection="column">
      <Container
        flexWrap="wrap"
        alignContent="flex-start"
        style={{ width: 380, height: 200 }}
      >
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
        <Cell>{t("Item")} 5</Cell>
        <Cell>{t("Item")} 6</Cell>
        <Cell>{t("Item")} 7</Cell>
      </Container>
      <Container
        flexWrap="wrap"
        alignContent="flex-end"
        style={{ width: 380, height: 200 }}
      >
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
        <Cell>{t("Item")} 5</Cell>
        <Cell>{t("Item")} 6</Cell>
        <Cell>{t("Item")} 7</Cell>
      </Container>
      <Container
        flexWrap="wrap"
        alignContent="center"
        style={{ width: 380, height: 200 }}
      >
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
        <Cell>{t("Item")} 5</Cell>
        <Cell>{t("Item")} 6</Cell>
        <Cell>{t("Item")} 7</Cell>
      </Container>
      <Container
        flexWrap="wrap"
        alignContent="space-between"
        style={{ width: 380, height: 200 }}
      >
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
        <Cell>{t("Item")} 5</Cell>
        <Cell>{t("Item")} 6</Cell>
        <Cell>{t("Item")} 7</Cell>
      </Container>
      <Container
        flexWrap="wrap"
        alignContent="space-around"
        style={{ width: 380, height: 200 }}
      >
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
        <Cell>{t("Item")} 5</Cell>
        <Cell>{t("Item")} 6</Cell>
        <Cell>{t("Item")} 7</Cell>
      </Container>
      <Container
        flexWrap="wrap"
        alignContent="space-evenly"
        style={{ width: 380, height: 200 }}
      >
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
        <Cell>{t("Item")} 5</Cell>
        <Cell>{t("Item")} 6</Cell>
        <Cell>{t("Item")} 7</Cell>
      </Container>
      <Container
        flexWrap="wrap"
        alignContent="stretch"
        style={{ width: 380, height: 200 }}
      >
        <Cell>{t("Item")} 1</Cell>
        <Cell>{t("Item")} 2</Cell>
        <Cell>{t("Item")} 3</Cell>
        <Cell>{t("Item")} 4</Cell>
        <Cell>{t("Item")} 5</Cell>
        <Cell>{t("Item")} 6</Cell>
        <Cell>{t("Item")} 7</Cell>
      </Container>
    </Container>
  );
};

export const Order = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Cell order={3}>{t("Item")} 1</Cell>
      <Cell order={2}>{t("Item")} 2</Cell>
      <Cell order={1}>{t("Item")} 3</Cell>
    </Container>
  );
};

export const Grow = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Cell flexGrow={1}>{t("Item")} 1</Cell>
      <Cell>{t("Item")} 2</Cell>
      <Cell>{t("Item")} 3</Cell>
    </Container>
  );
};

export const Shrink = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Cell w={100}>{t("Item")} 1</Cell>
      <Cell flexShrink={1}>{t("Item")} 2</Cell>
      <Cell flexShrink={0}>{t("Item")} 3</Cell>
    </Container>
  );
};

export const AlignSelf = () => {
  const { t } = useTranslation();
  return (
    <Container alignItems="flex-start" style={{ height: 150 }}>
      <Cell>{t("Item")} 1</Cell>
      <Cell alignSelf="flex-end">{t("Item")} 2</Cell>
      <Cell>{t("Item")} 3</Cell>
    </Container>
  );
};

export default config;
