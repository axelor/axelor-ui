import { Box } from '../../core';
import { BootstrapIcon, BootstrapIconProps } from './bootstrap-icon';

const config = {
  component: BootstrapIcon,
  title: 'Icons/Bootstrap',
};

const IconBox = (props: BootstrapIconProps) => {
  const { icon } = props;
  return (
    <Box
      bg="light"
      rounded
      d="flex"
      flexDirection="column"
      alignItems="center"
      g={1}
      p={3}
    >
      <Box fontSize={2}>
        <BootstrapIcon {...props} />
      </Box>
      <span>{icon}</span>
    </Box>
  );
};

export const Basic = () => {
  return (
    <Box
      d="flex"
      g={2}
      alignItems="flex-start"
      flexFlow="row-reverse"
      justifyContent="start"
    >
      <Box d="flex" g={2}>
        <IconBox icon="search" />
        <IconBox icon="house" />
        <IconBox icon="list" />
        <IconBox icon="x-lg" />
        <IconBox icon="gear" />
        <IconBox icon="chevron-down" />
        <IconBox icon="check-lg" />
      </Box>
    </Box>
  );
};

export default config;
