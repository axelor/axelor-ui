/**
 * @title Colors
 */
import React from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@axelor-ui/core';
import { TableFoot } from '../table-foot';

export default () => {
  return (
    <Box>
      <Table>
        <TableHead color="danger">
          <TableRow>
            <TableCell as="th" colSpan={3}>
              Header
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Default</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="primary">
            <TableCell>Primary</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="secondary">
            <TableCell>Secondary</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="success">
            <TableCell>Success</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="danger">
            <TableCell>Danger</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="warning">
            <TableCell>Warning</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="info">
            <TableCell>Info</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="light">
            <TableCell>Light</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="dark">
            <TableCell>Dark</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
        <TableFoot color="info">
          <TableRow>
            <TableCell as="th" colSpan={3}>
              Footer
            </TableCell>
          </TableRow>
        </TableFoot>
      </Table>
    </Box>
  );
};
