import React, { useCallback } from 'react';
import { addons, types } from '@storybook/addons';
import {
  WithTooltip,
  TooltipLinkList,
  IconButton,
  Icons,
  Separator,
} from '@storybook/components';
import { useGlobals } from '@storybook/api';

import { ADDON_ID, PARAM_KEY, ITEMS, RTL_LANGUAGES } from './constants';
import {
  PARAM_KEY as DIRECTION_PARAM_KEY,
  DIRECTION,
} from '../rtl-switch/constants';

export const isRTLLanguage = locale => {
  return RTL_LANGUAGES.includes(locale);
};

function Locale() {
  const [globals, updateGlobals] = useGlobals();
  const currentValue = globals[PARAM_KEY];
  const hasGlobalValue = Boolean(currentValue);

  const handleItemClick = useCallback(
    locale => {
      updateGlobals({
        [PARAM_KEY]: locale,
        [DIRECTION_PARAM_KEY]: isRTLLanguage(locale)
          ? DIRECTION.RTL
          : DIRECTION.LTR,
      });
    },
    [currentValue, updateGlobals]
  );

  return (
    <>
      <Separator />
      <WithTooltip
        placement="top"
        trigger="click"
        tooltip={({ onHide }) => {
          const links = ITEMS.map(item => {
            const { value, left, right, title } = item;
            return {
              id: value,
              active: currentValue === value,
              onClick: () => {
                handleItemClick(value);
                onHide();
              },
              left,
              title,
              right,
            };
          });
          return <TooltipLinkList links={links} />;
        }}
        closeOnClick
      >
        <IconButton title="Locale" active={hasGlobalValue}>
          <Icons icon="globe" />
        </IconButton>
      </WithTooltip>
    </>
  );
}

addons.register(ADDON_ID, function () {
  addons.add(ADDON_ID, {
    title: 'Locale',
    type: types.TOOL,
    match: () => true,
    render: () => <Locale/>,
  });
});
