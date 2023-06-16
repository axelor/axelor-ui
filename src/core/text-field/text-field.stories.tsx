import { Meta } from "@storybook/react";
import { useState } from "react";

import { MaterialIcon } from "../../icons/material-icon";
import { Box } from "../box";
import { TextField } from "./text-field";

const config = {
  component: TextField,
  title: "Components/TextField",
  decorators: [
    (Story) => (
      <Box style={{ width: 400 }}>
        <Story />
      </Box>
    ),
  ],
} as Meta;

export const Basic = () => {
  const [value, setValue] = useState("");
  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <TextField
        label={
          <Box display="flex" alignItems="center">
            <Box pe={2}>Field Label</Box>
            <MaterialIcon icon="translate" />
          </Box>
        }
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        icons={[
          {
            icon: "calendar_month",
          },
          {
            icon: "alarm",
          },
        ]}
      />
      <TextField
        label="Field Label"
        value={value}
        invalid
        onChange={(e: any) => setValue(e.target.value)}
        icons={[
          {
            icon: "calendar_month",
          },
          {
            icon: "alarm",
          },
        ]}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
      <TextField
        label="Disabled Field"
        value={value}
        disabled
        onChange={(e: any) => setValue(e.target.value)}
        icons={[
          {
            icon: "calendar_month",
          },
          {
            icon: "alarm",
          },
        ]}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </Box>
  );
};

export default config;
