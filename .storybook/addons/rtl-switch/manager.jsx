import React, { useCallback } from 'react';
import { addons, types } from '@storybook/addons';
import { useGlobals } from '@storybook/api';
import { Icons, IconButton, Separator } from '@storybook/components';

import { ADDON_ID, DIRECTION, PARAM_KEY } from './constants';

function RTLSwitch() {
  const [globals, updateGlobals] = useGlobals();

  const rtl = globals[PARAM_KEY] === DIRECTION.RTL;

  const toggleRTL = useCallback(() => {
    updateGlobals({
      [PARAM_KEY]: rtl ? DIRECTION.LTR : DIRECTION.RTL,
    });
  }, [rtl]);

  return (
    <>
      <Separator />
      <IconButton
        key={ADDON_ID}
        title="Set RTL document direction"
        onClick={toggleRTL}
        active={rtl}
      >
        <Icons icon="redirect" />
      </IconButton>
    </>
  );
}

addons.register(ADDON_ID, function () {
  addons.add(ADDON_ID, {
    title: 'RTL Switch',
    type: types.TOOL,
    match: () => true,
    render: () => <RTLSwitch/>,
  });
});
