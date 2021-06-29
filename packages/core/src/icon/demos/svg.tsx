/**
 * @title Using SVG
 */
import React from 'react';
import { Box, Icon } from '@axelor-ui/core';

import { ReactComponent as BiHeartFill } from 'bootstrap-icons/icons/heart-fill.svg';
import { ReactComponent as BiToggles } from 'bootstrap-icons/icons/toggles.svg';
import { ReactComponent as BiShop } from 'bootstrap-icons/icons/shop.svg';

export default () => {
  return (
    <Box>
      <Icon use={BiHeartFill} size={2} title="Heart" />
      <Icon use={BiToggles} size={2} title="Toggle" />
      <Icon use={BiShop} size={2} title="Shope" />
    </Box>
  );
};
