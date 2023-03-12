import { Box } from "../box";
import { Stack } from "./stack";

const config = {
  component: Box,
  title: "Layout/Stack",
};

export const Basic = () => {
  return (
    <Stack gap={3}>
      <Box border p={2}>
        First item
      </Box>
      <Box border p={2}>
        Second item
      </Box>
      <Box border p={2}>
        Third item
      </Box>
    </Stack>
  );
};

export const Horizontal = () => {
  return (
    <Stack gap={3} horizontal>
      <Box border p={2}>
        First item
      </Box>
      <Box border p={2}>
        Second item
      </Box>
      <Box border p={2}>
        Third item
      </Box>
    </Stack>
  );
};

export default config;
