import { Box } from "../box";
import { Divider } from "./divider";

const config = {
  component: Divider,
  title: "Components/Divider",
};

export const Basic = () => {
  return (
    <Box p={5}>
      <Box border p={4} bgColor="body-tertiary" />
      <Divider />
      <Box border p={4} bgColor="body-tertiary" />
    </Box>
  );
};

export const Vertical = () => {
  return (
    <div>
      <Box d={"flex"} p={5} style={{ height: 200 }}>
        <Box border p={4} bgColor="body-tertiary" />
        <Divider vertical />
        <Box border p={4} bgColor="body-tertiary" />
      </Box>
    </div>
  );
};

export default config;
