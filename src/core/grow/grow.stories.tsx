import { useState } from "react";

import { Box } from "../box";
import { Button } from "../button";
import { Grow } from "./grow";

const config = {
  component: Grow,
  title: "Animation/Grow",
};

export const Basic = function () {
  const [show, setShow] = useState(false);
  const toggle = function () {
    setShow((prev) => !prev);
  };

  return (
    <Box>
      <Button variant="primary" onClick={toggle}>
        Toggle
      </Button>
      <Grow in={show}>
        <Box
          mt={2}
          shadow
          rounded
          bg="secondary"
          style={{ width: 300, height: 100 }}
        ></Box>
      </Grow>
    </Box>
  );
};

export default config;
