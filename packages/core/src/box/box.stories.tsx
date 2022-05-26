import { Box } from './box';

const config = {
  component: Box,
  title: 'Layout/Box',
};

export const Basic = () => {
  return (
    <Box style={{ width: 400 }}>
      <Box p={4} border>
        Welcome to Box
      </Box>
    </Box>
  );
};

export const Border = () => {
  return (
    <Box display="flex">
      <Box p={5} m={2} border>
        square
      </Box>
      <Box p={5} m={2} border rounded={2} borderWidth={2}>
        rounded
      </Box>
      <Box p={5} m={2} border borderColor="primary">
        primary
      </Box>
      <Box p={5} m={2} borderTop bgColor="light">
        top
      </Box>
      <Box p={5} m={2} borderEnd bgColor="light">
        end
      </Box>
      <Box p={5} m={2} borderBottom bgColor="light">
        bottom
      </Box>
      <Box p={5} m={2} borderStart bgColor="light">
        start
      </Box>
    </Box>
  );
};

const colors: any = {
  primary: 'white',
  secondary: 'white',
  success: 'white',
  danger: 'white',
  warning: 'dark',
  info: 'dark',
  light: 'dark',
  dark: 'white',
  body: 'dark',
  white: 'dark',
  transparent: 'dark',
};

const gradientIgnore = ['body', 'white', 'transparent'];

export const Background = () => {
  return (
    <Box style={{ width: 400 }}>
      {(Object.keys(colors) as Array<any>).map(c => (
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
        .filter(c => gradientIgnore.indexOf(c) == -1)
        .map(c => (
          <Box key={c} p={3} m={2} bgColor={c} color={colors[c]} bgGradient>
            {c} gradient
          </Box>
        ))}
    </Box>
  );
};

export const Shadow = () => {
  return (
    <Box style={{ width: 400 }}>
      <Box shadow={false} p={3} mb={5} bgColor="light" rounded={2}>
        No shadow
      </Box>
      <Box shadow="sm" p={3} mb={5} bgColor="body" rounded={2}>
        Small shadow
      </Box>
      <Box shadow p={3} mb={5} bgColor="body" rounded={2}>
        Regular shadow
      </Box>
      <Box shadow="lg" p={3} mb={5} bgColor="body" rounded={2}>
        Larger shadow
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
    <Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="primary">
        link-primary
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="secondary">
        link-secondary
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="success">
        link-success
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="danger">
        link-danger
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="warning">
        link-warning
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="info">
        link-info
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="light">
        link-light
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="dark">
        link-dark
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
        </Box>{' '}
        can not be clicked.
      </Box>
      <Box as="p">
        <Box as="a" href="#" pointerEvents="auto">
          This link
        </Box>{' '}
        can be clicked (this is default behavior).
      </Box>
      <Box as="p" pointerEvents="none">
        <Box as="a" href="#" aria-disabled="true">
          This link
        </Box>{' '}
        can not be clicked because the <code>pointer-events</code> property is
        inherited from its parent. However,{' '}
        <Box as="a" href="#" pointerEvents="auto">
          this link
        </Box>{' '}
        has a <code>pe-auto</code> class and can be clicked.
      </Box>
    </Box>
  );
};

export const Text = () => {
  return (
    <Box style={{ width: 400 }}>
      <Box p={1} mb={1} color="primary">
        text-primary
      </Box>
      <Box p={1} mb={1} color="secondary">
        text-secondary
      </Box>
      <Box p={1} mb={1} color="success">
        text-success
      </Box>
      <Box p={1} mb={1} color="danger">
        text-danger
      </Box>
      <Box p={1} mb={1} color="warning" bgColor="dark">
        text-warning
      </Box>
      <Box p={1} mb={1} color="info" bgColor="dark">
        text-info
      </Box>
      <Box p={1} mb={1} color="light" bgColor="dark">
        text-light
      </Box>
      <Box p={1} mb={1} color="dark">
        text-dark
      </Box>
      <Box p={1} mb={1} color="body">
        text-body
      </Box>
      <Box p={1} mb={1} color="muted">
        text-muted
      </Box>
      <Box p={1} mb={1} color="white" bgColor="dark">
        text-white
      </Box>
      <Box p={1} mb={1} color="black-50">
        text-black-50
      </Box>
      <Box p={1} mb={1} color="white-50" bgColor="dark">
        text-white-50
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
      <Box as="p" textAlign={{ sm: 'start' }}>
        Start aligned text on viewports sized SM (small) or wider.
      </Box>
      <Box as="p" textAlign={{ md: 'start' }}>
        Start aligned text on viewports sized MD (medium) or wider.
      </Box>
      <Box as="p" textAlign={{ lg: 'start' }}>
        Start aligned text on viewports sized LG (large) or wider.
      </Box>
      <Box as="p" textAlign={{ xl: 'start' }}>
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
        bgColor="light"
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
        bgColor="light"
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
        bgColor="light"
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
        bgColor="light"
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

export default config;
