import { useState } from "react";

import { Box } from "../box";
import { Switch } from "./switch";

const config = {
  component: Switch,
  title: "Components/Switch",
};

export const Basic = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      data-testid="switch"
      checked={checked}
      onChange={(e: any) => setChecked(e.target.checked)}
    />
  );
};

export const Disabled = () => {
  return <Switch data-testid="switch" checked={true} disabled />;
};

export const Invalid = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      data-testid="switch"
      invalid
      checked={checked}
      onChange={(e: any) => setChecked(e.target.checked)}
    />
  );
};

export const Readonly = () => {
  const [checked, setChecked] = useState(true);

  return (
    <Switch
      data-testid="switch"
      readOnly
      checked={checked}
      onChange={(e: any) => setChecked(e.target.checked)}
    />
  );
};

export const Sizes = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (e: any) => setChecked(e.target.checked);

  return (
    <Box>
      <Switch
        data-testid="switch"
        checked={checked}
        onChange={handleChange}
        size="sm"
      />
      <Switch data-testid="switch" checked={checked} onChange={handleChange} />
      <Switch
        data-testid="switch"
        checked={checked}
        onChange={handleChange}
        size="lg"
      />
    </Box>
  );
};

export default config;
