/**
 * @title Colors
 */
import React from 'react';
import { Box, Badge } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Badge m={1} bg="primary">
        Primary
      </Badge>

      <Badge m={1} bg="secondary">
        Secondary
      </Badge>

      <Badge m={1} bg="success">
        Success
      </Badge>

      <Badge m={1} bg="danger">
        Danger
      </Badge>

      <Badge m={1} bg="warning" color="dark">
        Warning
      </Badge>

      <Badge m={1} bg="info" color="dark">
        Info
      </Badge>

      <Badge m={1} bg="light" color="dark">
        Light
      </Badge>

      <Badge m={1} bg="dark">
        Dark
      </Badge>

      <Box />

      <Badge m={1} bgColor="primary" rounded="pill">
        Primary
      </Badge>

      <Badge m={1} bgColor="secondary" rounded="pill">
        Secondary
      </Badge>

      <Badge m={1} bgColor="success" rounded="pill">
        Success
      </Badge>

      <Badge m={1} bgColor="danger" rounded="pill">
        Danger
      </Badge>

      <Badge m={1} bgColor="warning" rounded="pill" color="dark">
        Warning
      </Badge>

      <Badge m={1} bgColor="info" rounded="pill" color="dark">
        Info
      </Badge>

      <Badge m={1} bgColor="light" rounded="pill" color="dark">
        Light
      </Badge>

      <Badge m={1} bgColor="dark" rounded="pill">
        Dark
      </Badge>
    </Box>
  );
};
