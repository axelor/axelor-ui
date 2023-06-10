import type { Meta, StoryObj } from "@storybook/react";

import { Box } from "./box";

const meta = {
  title: "Layout/Box",
  component: Box,
} satisfies Meta<typeof Box>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    border: true,
    p: 4,
    children: "Welcome!",
  },
};

export const Border = () => {
  return (
    <Box display="flex">
      <Box p={5} m={2} border bg="body-tertiary">
        square
      </Box>
      <Box p={5} m={2} border rounded={2} borderWidth={2} bg="body-tertiary">
        rounded
      </Box>
      <Box p={5} m={2} border borderColor="primary" bg="body-tertiary">
        primary
      </Box>
      <Box p={5} m={2} borderTop bg="body-tertiary">
        top
      </Box>
      <Box p={5} m={2} borderEnd bg="body-tertiary">
        end
      </Box>
      <Box p={5} m={2} borderBottom bg="body-tertiary">
        bottom
      </Box>
      <Box p={5} m={2} borderStart bg="body-tertiary">
        start
      </Box>
    </Box>
  );
};

const colors: any = {
  primary: "white",
  "primary-subtle": "primary-emphasis",
  secondary: "white",
  "secondary-subtle": "secondary-emphasis",
  success: "white",
  "success-subtle": "success-emphasis",
  danger: "white",
  "danger-subtle": "danger-emphasis",
  warning: "dark",
  "warning-subtle": "warning-emphasis",
  info: "dark",
  "info-subtle": "info-emphasis",
  light: "dark",
  "light-subtle": "light-emphasis",
  dark: "white",
  "dark-subtle": "dark-emphasis",
  body: "body",
  "body-secondary": "body",
  "body-tertiary": "body",
  white: "dark",
  transparent: "body",
};

const gradientIgnore = [
  "body",
  "body-secondary",
  "body-tertiary",
  "white",
  "transparent",
];

export const Background = () => {
  return (
    <Box style={{ width: 400 }}>
      {(Object.keys(colors) as Array<any>).map((c) => (
        <Box key={c} p={3} m={2} bgColor={c} color={colors[c]}>
          {c}
        </Box>
      ))}
    </Box>
  );
};

export const Gradient = () => {
  return (
    <Box style={{ width: 400 }}>
      {(Object.keys(colors) as Array<any>)
        .filter((c) => gradientIgnore.indexOf(c) === -1)
        .map((c) => (
          <Box key={c} p={3} m={2} bgColor={c} color={colors[c]} bgGradient>
            {c} gradient
          </Box>
        ))}
    </Box>
  );
};

export const BoxShadow = () => {
  return (
    <Box style={{ width: 400 }} bgColor="body-tertiary" p={4}>
      <Box shadow={false} p={3} mb={5} bgColor="body" rounded={2}>
        No Shadow
      </Box>
      <Box shadow p={3} mb={5} bgColor="body" rounded={2}>
        Regular Shadow
      </Box>
      <Box shadow="sm" p={3} mb={5} bgColor="body" rounded={2}>
        Small Shadow
      </Box>
      <Box shadow="md" p={3} mb={5} bgColor="body" rounded={2}>
        Medium Shadow
      </Box>
      <Box shadow="lg" p={3} mb={5} bgColor="body" rounded={2}>
        Large Shadow
      </Box>
      <Box shadow="xl" p={3} mb={5} bgColor="body" rounded={2}>
        Larger Shadow
      </Box>
      <Box shadow="2xl" p={3} mb={5} bgColor="body" rounded={2}>
        2x Larger Shadow
      </Box>
      <Box shadow="inner" p={3} mb={5} bgColor="body" rounded={2}>
        Inner Shadow
      </Box>
    </Box>
  );
};

export const DropShadow = () => {
  return (
    <Box style={{ width: 400 }} bgColor="body-tertiary" p={4}>
      <Box dropShadow={false} p={3} mb={5} bgColor="body" rounded={2}>
        No Shadow
      </Box>
      <Box dropShadow p={3} mb={5} bgColor="body" rounded={2}>
        Regular Shadow
      </Box>
      <Box dropShadow="sm" p={3} mb={5} bgColor="body" rounded={2}>
        Small Shadow
      </Box>
      <Box dropShadow="md" p={3} mb={5} bgColor="body" rounded={2}>
        Medium Shadow
      </Box>
      <Box dropShadow="lg" p={3} mb={5} bgColor="body" rounded={2}>
        Large Shadow
      </Box>
      <Box dropShadow="xl" p={3} mb={5} bgColor="body" rounded={2}>
        Larger Shadow
      </Box>
      <Box dropShadow="2xl" p={3} mb={5} bgColor="body" rounded={2}>
        2x Larger Shadow
      </Box>
    </Box>
  );
};

export const Display = () => {
  return (
    <Box style={{ width: 400 }}>
      <Box mb={2}>
        <Box d="inline" p={1} bgColor="primary" color="white">
          inline
        </Box>
        <Box d="inline" p={1} bgColor="dark" color="white">
          inline
        </Box>
      </Box>
      <Box mb={2}>
        <Box d="block" p={1} bgColor="primary" color="white">
          block
        </Box>
        <Box d="block" p={1} bgColor="dark" color="white">
          block
        </Box>
      </Box>
    </Box>
  );
};

export const Float = () => {
  return (
    <Box>
      <Box float="start">Float start on all viewport sizes</Box>
      <br />
      <Box float="end">Float end on all viewport sizes</Box>
      <br />
      <Box float="none">Don't float on all viewport sizes</Box>
    </Box>
  );
};

export const Link = () => {
  return (
    <Box d="flex" flexDirection="column">
      <Box as="a" href="#" p={1} mb={1} linkColor="primary">
        Primary Link
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="secondary">
        Secondary Link
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="success">
        Success Link
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="danger">
        Danger Link
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="warning">
        Warning Link
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="info">
        Info Link
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="light">
        Light Link
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="dark">
        Dark Link
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="body-emphasis">
        Emphasis link
      </Box>
    </Box>
  );
};

export const PointerEvents = () => {
  return (
    <Box>
      <Box as="p">
        <Box as="a" href="#" pointerEvents="none" aria-disabled="true">
          This link
        </Box>{" "}
        can not be clicked.
      </Box>
      <Box as="p">
        <Box as="a" href="#" pointerEvents="auto">
          This link
        </Box>{" "}
        can be clicked (this is default behavior).
      </Box>
      <Box as="p" pointerEvents="none">
        <Box as="a" href="#" aria-disabled="true">
          This link
        </Box>{" "}
        can not be clicked because the pointer-events property is inherited from
        its parent. However,"{" "}
        <Box as="a" href="#" pointerEvents="auto">
          This link
        </Box>{" "}
        has a pe-auto class and can be clicked.
      </Box>
    </Box>
  );
};

export const Opacity = () => {
  return (
    <Box d="flex" style={{ width: 400 }}>
      <Box
        opacity={100}
        p={3}
        m={2}
        bg="primary"
        color="light"
        fontWeight="bold"
        rounded
      >
        100%
      </Box>
      <Box
        opacity={75}
        p={3}
        m={2}
        bg="primary"
        color="light"
        fontWeight="bold"
        rounded
      >
        75%
      </Box>
      <Box
        opacity={50}
        p={3}
        m={2}
        bg="primary"
        color="light"
        fontWeight="bold"
        rounded
      >
        59%
      </Box>
      <Box
        opacity={25}
        p={3}
        m={2}
        bg="primary"
        color="light"
        fontWeight="bold"
        rounded
      >
        25%
      </Box>
      <Box
        opacity={0}
        p={3}
        m={2}
        bg="primary"
        color="light"
        fontWeight="bold"
        rounded
      >
        0%
      </Box>
    </Box>
  );
};

export const Text = () => {
  return (
    <Box style={{ width: 400 }}>
      <Box p={1} mb={1} color="primary">
        primary
      </Box>
      <Box p={1} mb={1} color="primary-emphasis">
        primary-emphasis
      </Box>
      <Box p={1} mb={1} color="secondary">
        secondary
      </Box>
      <Box p={1} mb={1} color="secondary-emphasis">
        secondary-emphasis
      </Box>
      <Box p={1} mb={1} color="success">
        success
      </Box>
      <Box p={1} mb={1} color="success-emphasis">
        success-emphasis
      </Box>
      <Box p={1} mb={1} color="danger">
        danger
      </Box>
      <Box p={1} mb={1} color="danger-emphasis">
        danger
      </Box>
      <Box p={1} mb={1} color="warning" bgColor="dark">
        warning
      </Box>
      <Box p={1} mb={1} color="warning-emphasis">
        warning-emphasis
      </Box>
      <Box p={1} mb={1} color="info" bgColor="dark">
        info
      </Box>
      <Box p={1} mb={1} color="info-emphasis">
        info-emphasis
      </Box>
      <Box p={1} mb={1} color="light" bgColor="dark">
        light
      </Box>
      <Box p={1} mb={1} color="light-emphasis">
        light-emphasis
      </Box>
      <Box p={1} mb={1} color="dark">
        dark
      </Box>
      <Box p={1} mb={1} color="dark-emphasis">
        dark-emphasis
      </Box>
      <Box p={1} mb={1} color="body">
        body
      </Box>
      <Box p={1} mb={1} color="body-emphasis">
        body-emphasis
      </Box>
      <Box p={1} mb={1} color="body-secondary">
        body-secondary
      </Box>
      <Box p={1} mb={1} color="body-tertiary">
        body-terniary
      </Box>
      <Box p={1} mb={1} color="white" bgColor="dark">
        white
      </Box>
      <Box p={1} mb={1} color="black">
        black
      </Box>
      <Box p={1} mb={1} color="black-50">
        black_50
      </Box>
      <Box p={1} mb={1} color="white-50" bgColor="dark">
        white_50
      </Box>
    </Box>
  );
};

export const TextAlign = () => {
  return (
    <Box>
      <Box as="p" textAlign="start">
        Start aligned text on all viewport sizes.
      </Box>
      <Box as="p" textAlign="center">
        Center aligned text on all viewport sizes.
      </Box>
      <Box as="p" textAlign="end">
        End aligned text on all viewport sizes.
      </Box>
      <Box as="p" textAlign={{ sm: "start" }}>
        Start aligned text on viewports sized SM (small) or wider.
      </Box>
      <Box as="p" textAlign={{ md: "start" }}>
        Start aligned text on viewports sized MD (medium) or wider.
      </Box>
      <Box as="p" textAlign={{ lg: "start" }}>
        Start aligned text on viewports sized LG (large) or wider.
      </Box>
      <Box as="p" textAlign={{ xl: "start" }}>
        Start aligned text on viewports sized XL (extra-large) or wider.
      </Box>
    </Box>
  );
};

export const FontSize = () => {
  return (
    <Box>
      <Box as="p" fontSize={1}>
        fontSize={`{1}`} text
      </Box>
      <Box as="p" fontSize={2}>
        fontSize={`{2}`} text
      </Box>
      <Box as="p" fontSize={3}>
        fontSize={`{3}`} text
      </Box>
      <Box as="p" fontSize={4}>
        fontSize={`{4}`} text
      </Box>
      <Box as="p" fontSize={5}>
        fontSize={`{5}`} text
      </Box>
      <Box as="p" fontSize={6}>
        fontSize={`{6}`} text
      </Box>
    </Box>
  );
};

export const FontWeight = () => {
  return (
    <Box>
      <Box as="p" fontWeight="bold">
        Bold text.
      </Box>
      <Box as="p" fontWeight="bolder">
        Bolder weight text (relative to the parent element).
      </Box>
      <Box as="p" fontWeight="normal">
        Normal weight text.
      </Box>
      <Box as="p" fontWeight="light">
        Light weight text.
      </Box>
      <Box as="p" fontWeight="lighter">
        Lighter weight text (relative to the parent element).
      </Box>
      <Box as="p" fontStyle="italic">
        Italic text.
      </Box>
      <Box as="p" fontStyle="normal">
        Text with normal font style
      </Box>
    </Box>
  );
};

export const Overflow = () => {
  return (
    <Box display="flex">
      <Box
        overflow="auto"
        p={3}
        mb={{
          base: 3,
          md: 0,
        }}
        me={{
          md: 3,
        }}
        bgColor="body-tertiary"
        style={{
          maxWidth: 260,
          maxHeight: 100,
        }}
      >
        This is an example of using <code>.overflow-auto</code> on an element
        with set width and height dimensions. By design, this content will
        vertically scroll.
      </Box>
      <Box
        overflow="hidden"
        p={3}
        mb={{
          base: 3,
          md: 0,
        }}
        me={{
          md: 3,
        }}
        bgColor="body-tertiary"
        style={{
          maxWidth: 260,
          maxHeight: 100,
        }}
      >
        This is an example of using <code>.overflow-hidden</code> on an element
        with set width and height dimensions.
      </Box>
      <Box
        overflow="visible"
        p={3}
        mb={{
          base: 3,
          md: 0,
        }}
        me={{
          md: 3,
        }}
        bgColor="body-tertiary"
        style={{
          maxWidth: 260,
          maxHeight: 100,
        }}
      >
        This is an example of using <code>.overflow-visible</code> on an element
        with set width and height dimensions.
      </Box>
      <Box
        overflow="scroll"
        p={3}
        bgColor="body-tertiary"
        style={{
          maxWidth: 260,
          maxHeight: 100,
        }}
      >
        This is an example of using <code>.overflow-scroll</code> on an element
        with set width and height dimensions.
      </Box>
    </Box>
  );
};
