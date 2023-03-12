import { ReactComponent as BiAlarm } from "bootstrap-icons/icons/alarm.svg";
import { ReactComponent as BiHeartFill } from "bootstrap-icons/icons/heart-fill.svg";
import { ReactComponent as BiShop } from "bootstrap-icons/icons/shop.svg";
import { ReactComponent as BiToggles } from "bootstrap-icons/icons/toggles.svg";

import { Box } from "../../core";
import { SvgIcon } from "./svg-icon";

const config = {
  component: SvgIcon,
  title: "Icons/Svg",
};

export const Name = () => {
  return (
    <Box>
      <SvgIcon as={BiAlarm} size={2} title="Alarm" color="primary" />
    </Box>
  );
};

export const Svg = () => {
  return (
    <Box>
      <SvgIcon as={BiHeartFill} size={2} title="Heart" />
      <SvgIcon as={BiToggles} size={2} title="Toggle" />
      <SvgIcon as={BiShop} size={2} title="Shope" />
    </Box>
  );
};

export default config;
