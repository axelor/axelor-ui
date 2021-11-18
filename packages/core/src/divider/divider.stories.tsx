import { Box } from '../box';
import { Divider } from './divider';

export default {
  component: Divider,
  title: 'Components/Divider',
};

export const Basic = () => {
  return (
    <Box p={5}>
      <Box border p={4} bgColor="light" />
      <Divider />
      <Box border p={4} bgColor="light" />
    </Box>
  );
};

export const Vertical = () => {
  return (
    <div>
      <Box d={'flex'} p={5} style={{ height: 200 }}>
        <Box border p={4} bgColor="light" />
        <Divider vertical />
        <Box border p={4} bgColor="light" />
      </Box>
    </div>
  );
};
