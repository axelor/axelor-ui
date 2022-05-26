import React from 'react';
import { ReactComponent as BiArrowCounterclockwise } from 'bootstrap-icons/icons/arrow-counterclockwise.svg';
import { ReactComponent as BiArrowClockwise } from 'bootstrap-icons/icons/arrow-clockwise.svg';
import { ReactComponent as BiScissors } from 'bootstrap-icons/icons/scissors.svg';
import { ReactComponent as BiClipboard } from 'bootstrap-icons/icons/clipboard.svg';
import { ReactComponent as BiClipboardCheck } from 'bootstrap-icons/icons/clipboard-check.svg';
import { ReactComponent as BiThreeDotsVertical } from 'bootstrap-icons/icons/three-dots-vertical.svg';

import { Menu } from '../menu/menu';
import { MenuItem } from '../menu/menu-item';
import { MenuDivider } from '../menu/menu-divider';
import { Menubar } from './menubar';
import { Button } from '../button';
import { Icon } from '../icon';
import { OverflowList, OverflowListTypes } from '../overflow-list';
import { Box } from '../box';

const config = {
  component: Menubar,
  title: 'Components/Menubar',
};

export const Basic = () => {
  return (
    <Menubar>
      <Menu text="File">
        <MenuItem text="Share" />
        <MenuDivider />
        <MenuItem text="New">
          <MenuItem text="Document" />
          <MenuItem text="Spreadsheet" />
          <MenuItem text="Image">
            <MenuItem text="JPG" />
            <MenuItem text="PNG" />
          </MenuItem>
        </MenuItem>
        <MenuItem text="Open" disabled />
        <MenuDivider />
        <MenuItem text="Print" label="Ctrl+P" />
      </Menu>
      <Menu text="Edit">
        <MenuItem
          text="Undo"
          startIcon={BiArrowCounterclockwise}
          label="Ctrl+Z"
        />
        <MenuItem text="Redo" startIcon={BiArrowClockwise} label="Ctrl+Y" />
        <MenuDivider />
        <MenuItem text="Cut" startIcon={BiScissors} label="Ctrl+X" />
        <MenuItem text="Copy" startIcon={BiClipboard} label="Ctrl+C" />
        <MenuItem text="Paste" startIcon={BiClipboardCheck} label="Ctrl+P" />
      </Menu>
      <Menu text="View">
        <MenuItem text="Print Layout" />
        <MenuDivider />
        <MenuItem text="Mode">
          <MenuItem text="Presentation" />
          <MenuItem text="Edit" />
          <MenuItem text="Modifiable" />
          <MenuItem text="Context">
            <MenuItem text="New" />
            <MenuItem text="Exisiting" />
            <MenuItem text="Shape">
              <MenuItem text="Circle" />
              <MenuItem text="Square" />
              <MenuItem text="Rectangle" />
              <MenuItem text="Triangle" />
            </MenuItem>
          </MenuItem>
        </MenuItem>
      </Menu>
      <Menu text="Format">
        <MenuItem label="Ctrl+B" text="Bold" />
        <MenuItem label="Ctrl+I" text="Italic" />
        <MenuItem label="Ctrl+U" text="Underline" />
      </Menu>
    </Menubar>
  );
};

export const Responsive = () => {
  return (
    <Box style={{ marginLeft: 300 }}>
      <OverflowList
        as={Menubar}
        items={
          [
            <Menu key={0} text="File">
              <MenuItem text="Share" />
              <MenuDivider />
              <MenuItem text="New">
                <MenuItem text="Document" />
                <MenuItem text="Spreadsheet" />
                <MenuItem text="Image">
                  <MenuItem text="JPG" />
                  <MenuItem text="PNG" />
                </MenuItem>
              </MenuItem>
              <MenuItem text="Open" disabled />
              <MenuDivider />
              <MenuItem text="Print" label="Ctrl+P" />
            </Menu>,
            <Menu key={1} text="Edit">
              <MenuItem
                text="Undo"
                startIcon={BiArrowCounterclockwise}
                label="Ctrl+Z"
              />
              <MenuItem
                text="Redo"
                startIcon={BiArrowClockwise}
                label="Ctrl+Y"
              />
              <MenuDivider />
              <MenuItem text="Cut" startIcon={BiScissors} label="Ctrl+X" />
              <MenuItem text="Copy" startIcon={BiClipboard} label="Ctrl+C" />
              <MenuItem
                text="Paste"
                startIcon={BiClipboardCheck}
                label="Ctrl+P"
              />
            </Menu>,
            <Menu key={2} text="View">
              <MenuItem text="Print Layout" />
              <MenuDivider />
              <MenuItem text="Mode">
                <MenuItem text="Presentation" />
                <MenuItem text="Edit" />
                <MenuItem text="Modifiable" />
                <MenuItem text="Context">
                  <MenuItem text="New" />
                  <MenuItem text="Exisiting" />
                  <MenuItem text="Shape">
                    <MenuItem text="Circle" />
                    <MenuItem text="Square" />
                    <MenuItem text="Rectangle" />
                    <MenuItem text="Triangle" />
                  </MenuItem>
                </MenuItem>
              </MenuItem>
            </Menu>,
            <Menu key={3} text="Format">
              <MenuItem label="Ctrl+B" text="Bold" />
              <MenuItem label="Ctrl+I" text="Italic" />
              <MenuItem label="Ctrl+U" text="Underline" />
            </Menu>,
          ] as any
        }
        renderButton={(
          type: OverflowListTypes.OverflowListButtonType,
          props: any
        ) => {
          if (type === 'dropdown') {
            return (
              <Button {...props}>
                <Icon as={BiThreeDotsVertical} />
              </Button>
            );
          }
          return null;
        }}
        renderOverflow={(items: any[]) => (
          <Menubar flexDirection="column">
            {items.map((item, index) =>
              React.cloneElement(item, {
                key: index,
              })
            )}
          </Menubar>
        )}
      />
    </Box>
  );
};

export default config;
