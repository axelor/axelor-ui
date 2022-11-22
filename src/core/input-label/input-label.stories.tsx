import { Box } from '../box';
import { Input } from '../input';
import { InputLabel } from './input-label';

const config = {
  component: InputLabel,
  title: 'Components/InputLabel',
};

export const Basic = () => {
  return (
    <Box>
      <InputLabel>Email</InputLabel>
      <Input type="email" />
    </Box>
  );
};

export const Disabled = () => {
  return (
    <Box>
      <InputLabel disabled>Email</InputLabel>
      <Input type="email" disabled />
    </Box>
  );
};

export const Invalid = () => {
  return (
    <Box>
      <InputLabel invalid>Email</InputLabel>
      <Input type="email" invalid />
    </Box>
  );
};

export const Required = () => {
  return (
    <Box>
      <InputLabel required>Email</InputLabel>
      <Input type="email" required />
    </Box>
  );
};

export default config;
