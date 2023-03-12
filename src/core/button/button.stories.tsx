import { useState } from "react";

import { Box } from "../box";
import { Button } from "./button";

const config = {
  component: Button,
  title: "Components/Button",
};

export const Basic = () => {
  const [text, setText] = useState("Click me...");
  const onClick = () => {
    setText("Clicked!!!");
  };
  return (
    <Box display="flex" alignItems="center" g={2}>
      <Button variant="primary" onClick={onClick}>
        {text}
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </Box>
  );
};

export const Sizes = () => {
  return (
    <Box display="flex" alignItems="center" g={2}>
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary">Normal</Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
    </Box>
  );
};

export const Variants = () => {
  return (
    <Box display="flex" alignItems="center" g={2}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="info">Info</Button>
      <Button variant="light">Light</Button>
      <Button variant="dark">Dark</Button>
      <Button variant="link" as="a" href="#">
        Link
      </Button>
    </Box>
  );
};

export const Outline = () => {
  return (
    <Box display="flex" alignItems="center" g={2}>
      <Button variant="primary" outline>
        Primary
      </Button>
      <Button variant="secondary" outline>
        Secondary
      </Button>
      <Button variant="success" outline>
        Success
      </Button>
      <Button variant="danger" outline>
        Danger
      </Button>
      <Button variant="warning" outline>
        Warning
      </Button>
      <Button variant="info" outline>
        Info
      </Button>
      <Button variant="light" outline>
        Light
      </Button>
      <Button variant="dark" outline>
        Dark
      </Button>
    </Box>
  );
};

export default config;
