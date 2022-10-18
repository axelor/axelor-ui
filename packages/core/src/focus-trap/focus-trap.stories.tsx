import { Box } from '../box';
import { Button } from '../button';
import { Input } from '../input';
import { FocusTrap } from './focus-trap';

const config = {
  component: FocusTrap,
  title: 'Core/FocusTrap',
};

export const Basic = function () {
  return (
    <FocusTrap>
      <Box p={2} border borderColor="dark" bgColor="light">
        <Box as="h3" color="secondary">
          Information
        </Box>
        <Box>
          <Input m={1} placeholder="First Name" />
          <Input m={1} placeholder="Last Name" />
          <Input m={1} placeholder="Mobile" />
          <Button m={1} variant="primary">
            Save
          </Button>
          <Button m={1} variant="secondary">
            Cancel
          </Button>
        </Box>
      </Box>
    </FocusTrap>
  );
};

export default config;
