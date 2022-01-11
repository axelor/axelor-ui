import { ReactComponent as BiHeartFill } from 'bootstrap-icons/icons/heart-fill.svg';
import { ReactComponent as BiShop } from 'bootstrap-icons/icons/shop.svg';
import { ReactComponent as BiToggles } from 'bootstrap-icons/icons/toggles.svg';
import { ReactComponent as BiAlarm } from 'bootstrap-icons/icons/alarm.svg';

import { Box } from '../box';
import { Icon } from './icon';

export default {
  component: Icon,
  title: 'Components/Icon',
};

export const Name = () => {
  return (
    <Box>
      <Icon as={BiAlarm} size={2} title="Alarm" color="primary" />
    </Box>
  );
};

export const Svg = () => {
  return (
    <Box>
      <Icon as={BiHeartFill} size={2} title="Heart" />
      <Icon as={BiToggles} size={2} title="Toggle" />
      <Icon as={BiShop} size={2} title="Shope" />
    </Box>
  );
};
