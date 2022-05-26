import { Box } from '../box';
import { LinearProgress } from './linear-progress';

const config = {
  component: LinearProgress,
  title: 'Components/LinearProgress',
};

export const Animated = () => {
  return (
    <Box>
      <LinearProgress value={20} striped animated />
    </Box>
  );
};

export const Basic = () => {
  return (
    <Box>
      <LinearProgress value={20} />
    </Box>
  );
};

export const Indeterminate = () => {
  return (
    <Box>
      <LinearProgress indeterminate thickness={10} />
    </Box>
  );
};

export const Striped = () => {
  return (
    <Box>
      <LinearProgress value={20} striped />
    </Box>
  );
};

export const Thickness = () => {
  return (
    <Box>
      <LinearProgress value={20} thickness={30} />
    </Box>
  );
};

export default config;
