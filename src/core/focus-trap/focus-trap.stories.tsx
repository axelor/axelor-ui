import { Box } from "../box";
import { Button } from "../button";
import { Input } from "../input";
import { FocusTrap } from "./focus-trap";

const config = {
  component: FocusTrap,
  title: "Core/FocusTrap",
};

export const Basic = function () {
  return (
    <FocusTrap>
      <Box p={3} border rounded bgColor="body-tertiary">
        <Box as="h3" color="secondary">
          Information
        </Box>
        <Box>
          <Input my={2} placeholder="First Name" />
          <Input my={2} placeholder="Last Name" />
          <Input my={2} placeholder="Mobile" />
          <Button mt={2} variant="primary">
            Save
          </Button>
          <Button mt={2} ms={2} variant="secondary">
            Cancel
          </Button>
        </Box>
      </Box>
    </FocusTrap>
  );
};

export default config;
