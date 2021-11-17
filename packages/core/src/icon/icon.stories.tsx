import React from 'react';

import { ReactComponent as BiHeartFill } from 'bootstrap-icons/icons/heart-fill.svg';
import { ReactComponent as BiShop } from 'bootstrap-icons/icons/shop.svg';
import { ReactComponent as BiToggles } from 'bootstrap-icons/icons/toggles.svg';

import { Box } from '../box';
import { Icon } from './icon';

export default {
  component: Icon,
  title: 'Core/Icon',
};

export const Name = () => {
  return (
    <Box>
      <Icon use="alarm" size={2} title="Alarm" color="primary" />
    </Box>
  );
};

export const Svg = () => {
  return (
    <Box>
      <Icon use={BiHeartFill} size={2} title="Heart" />
      <Icon use={BiToggles} size={2} title="Toggle" />
      <Icon use={BiShop} size={2} title="Shope" />
    </Box>
  );
};
