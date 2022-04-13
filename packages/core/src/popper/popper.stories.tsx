import { useState } from 'react';
import * as React from 'react';

import { Box } from '../box';
import { Button } from '../button';
import { ClickAwayListener } from '../click-away-listener';
import { Grow } from '../grow';
import { Input } from '../input';
import { InputLabel } from '../input-label';
import { useClassNames } from '../styles';
import { Popper } from './popper';
import { usePopperTrigger } from './use-popper-trigger';

export default {
  component: Popper,
  title: 'Core/Popper',
};

export const Basic = () => {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);

  const toggle = () => setOpen(v => !v);

  return (
    <div>
      <Button variant="primary" ref={setTargetEl} onClick={toggle}>
        Button
      </Button>
      <Popper open={open} target={targetEl} offset={[0, 4]}>
        <Box p={2}>The content of the Popper.</Box>
      </Popper>
    </div>
  );
};

export const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);
  const classNames = useClassNames();
  const toggle = () => setOpen(v => !v);

  return (
    <div>
      <Button variant="primary" ref={setTargetEl} onClick={toggle}>
        Button
      </Button>
      <Popper open={open} target={targetEl} offset={[0, 4]} arrow>
        <ul
          className={classNames(
            'dropdown-menu show border-0 rounded-0 position-static bg-transparent'
          )}
        >
          <li>
            <a href="#" className={classNames('dropdown-item')}>
              Item 1
            </a>
          </li>
          <li>
            <a href="#" className={classNames('dropdown-item')}>
              Item 2
            </a>
          </li>
          <li>
            <a href="#" className={classNames('dropdown-item')}>
              Item 3
            </a>
          </li>
        </ul>
      </Popper>
    </div>
  );
};

function Example({ event, interactive }: any) {
  const { open, targetEl, setTargetEl, setContentEl, onClickAway } =
    usePopperTrigger({
      trigger: event,
      interactive,
    });

  return (
    <Box ms={1}>
      <Button textTransform="capitalize" variant="primary" ref={setTargetEl}>
        {event}
      </Button>
      <ClickAwayListener onClickAway={onClickAway}>
        <Popper open={open} target={targetEl} offset={[0, 4]}>
          <Box p={2} ref={setContentEl} style={{ width: 320 }}>
            <Box as="h4">Personal Information</Box>
            <Input mt={1} placeholder="First Name" />
            <Input mt={1} placeholder="Last Name" />
            <Button mt={1} variant="primary">
              Save
            </Button>
          </Box>
        </Popper>
      </ClickAwayListener>
    </Box>
  );
}

export const Hook = () => {
  const [interactive, setInteractive] = useState(false);

  return (
    <Box d="flex" alignItems="center">
      <Example event="click" interactive={interactive} />
      <Example event="hover" interactive={interactive} />
      <Example event="focus" interactive={interactive} />
      <InputLabel m={0} ms={2}>
        <Input
          type="checkbox"
          checked={interactive}
          onClick={() => setInteractive(checked => !checked)}
        />{' '}
        Interactive
      </InputLabel>
    </Box>
  );
};

const MyButton = ({ children, onClick }: any) => {
  return (
    <Button
      m={2}
      variant="primary"
      textTransform="capitalize"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export const Placement = () => {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);
  const [placement, setPlacement] = useState<any>();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newPlacement = e.currentTarget?.textContent || 'bottom';
    setTargetEl(e.currentTarget);
    setPlacement(newPlacement);
    setOpen(prev => placement !== newPlacement || !prev);
  };

  return (
    <Box style={{ width: 500 }} m="auto">
      <Popper
        target={targetEl}
        open={open}
        placement={placement}
        offset={[0, 4]}
        arrow
        shadow
        rounded
      >
        <Box p={3}>The content of the Popper.</Box>
      </Popper>
      <Box d="flex" justifyContent="center">
        <MyButton onClick={handleClick}>top-start</MyButton>
        <MyButton onClick={handleClick}>top</MyButton>
        <MyButton onClick={handleClick}>top-end</MyButton>
      </Box>
      <Box d="flex" justifyContent="center">
        <Box
          d="flex"
          flexDirection="column"
          alignItems="start"
          style={{ width: '50%' }}
        >
          <MyButton onClick={handleClick}>start-top</MyButton>
          <MyButton onClick={handleClick}>start</MyButton>
          <MyButton onClick={handleClick}>start-bottom</MyButton>
        </Box>
        <Box
          d="flex"
          flexDirection="column"
          alignItems="end"
          style={{ width: '50%' }}
        >
          <MyButton onClick={handleClick}>end-top</MyButton>
          <MyButton onClick={handleClick}>end</MyButton>
          <MyButton onClick={handleClick}>end-bottom</MyButton>
        </Box>
      </Box>
      <Box d="flex" justifyContent="center">
        <MyButton onClick={handleClick}>bottom-start</MyButton>
        <MyButton onClick={handleClick}>bottom</MyButton>
        <MyButton onClick={handleClick}>bottom-end</MyButton>
      </Box>
    </Box>
  );
};

export const Transition = () => {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);

  const toggle = () => setOpen(v => !v);

  return (
    <div>
      <Button variant="primary" ref={setTargetEl} onClick={toggle}>
        Button
      </Button>
      <Popper
        open={open}
        target={targetEl}
        transition={Grow}
        offset={[0, 4]}
        arrow
      >
        <Box p={2}>The content of the Popper.</Box>
      </Popper>
    </div>
  );
};
