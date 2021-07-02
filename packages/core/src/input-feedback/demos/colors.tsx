/**
 * @title Colors
 */
import React from 'react';
import { Box, InputFeedback, Input } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Input type="text" placeholder="Primary" />
      <InputFeedback color="primary">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </InputFeedback>

      <Input type="text" mt={2} placeholder="Secondary" />
      <InputFeedback color="secondary">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </InputFeedback>

      <Input type="text" mt={2} placeholder="Success" />
      <InputFeedback color="success">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </InputFeedback>

      <Input type="text" mt={2} placeholder="Danger" />
      <InputFeedback color="danger">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </InputFeedback>

      <Input type="text" mt={2} placeholder="Warning" />
      <InputFeedback color="warning">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </InputFeedback>

      <Input type="text" mt={2} placeholder="Info" />
      <InputFeedback color="info">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </InputFeedback>

      <Input type="text" mt={2} placeholder="Dark" />
      <InputFeedback color="dark">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </InputFeedback>
    </Box>
  );
};
