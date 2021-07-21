/**
 * @title Dropdown
 */

import React, { useState } from 'react';

import { Button, Popper } from '@axelor-ui/core';

import { styleNames } from '../../styles';

export default () => {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);

  const toggle = () => setOpen(v => !v);

  return (
    <div>
      <Button variant="primary" ref={setTargetEl} onClick={toggle}>
        Button
      </Button>
      <Popper open={open} target={targetEl} offset={[0, 4]} arrow>
        <ul
          className={styleNames(
            'dropdown-menu show border-0 rounded-0 position-static bg-transparent'
          )}
        >
          <li>
            <a href="#" className={styleNames('dropdown-item')}>
              Item 1
            </a>
          </li>
          <li>
            <a href="#" className={styleNames('dropdown-item')}>
              Item 2
            </a>
          </li>
          <li>
            <a href="#" className={styleNames('dropdown-item')}>
              Item 3
            </a>
          </li>
        </ul>
      </Popper>
    </div>
  );
};
