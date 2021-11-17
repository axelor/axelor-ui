import React from 'react';

import { Box } from '../box';
import { Input } from '../input';
import { InputFeedback } from './input-feedback';

export default {
  component: InputFeedback,
  title: 'Core/InputFeedback',
};

export const Basic = () => {
  return (
    <Box>
      <Input type="password" />
      <InputFeedback>
        Your password must be 8-20 characters long, contain letters and numbers,
        and must not contain spaces, special characters, or emoji.
      </InputFeedback>
    </Box>
  );
};

export const Colors = () => {
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

export const Invalid = () => {
  return (
    <Box>
      <Input type="password" invalid defaultValue="axelor" />
      <InputFeedback invalid>
        Your password must contain a special character
      </InputFeedback>
    </Box>
  );
};
