import { useTranslation } from "react-i18next";
import { Box } from "../box/box";

const config = {
  component: Box,
  title: "System/Colors",
};

const colors: any = {
  primary: "white",
  secondary: "white",
  success: "white",
  danger: "white",
  warning: "dark",
  info: "dark",
  light: "dark",
  dark: "white",
  body: "dark",
  white: "dark",
  transparent: "dark",
};

export const Theme = () => {
  const { t } = useTranslation();
  return (
    <Box style={{ width: 400 }}>
      {(Object.keys(colors) as Array<any>).map((c) => (
        <Box key={c} p={2} m={2} bgColor={c} color={colors[c]}>
          {t(c)}
        </Box>
      ))}
    </Box>
  );
};

const palette: any = {
  blue: "white",
  indigo: "white",
  purple: "white",
  pink: "white",
  red: "white",
  orange: "dark",
  yellow: "dark",
  green: "white",
  teal: "dark",
  cyan: "dark",
  black: "white",
  white: "dark",
};

const gray: any = {
  gray: "white",
  "gray-100": "dark",
  "gray-200": "dark",
  "gray-300": "dark",
  "gray-400": "dark",
  "gray-500": "dark",
  "gray-600": "white",
  "gray-700": "white",
  "gray-800": "white",
  "gray-900": "white",
};

export const Palette = () => {
  const { t } = useTranslation();
  return (
    <Box display="flex">
      <Box style={{ width: 400 }}>
        {(Object.keys(palette) as Array<any>).map((c) => (
          <Box
            key={c}
            p={2}
            m={2}
            style={{ backgroundColor: `var(--bs-${c})` }}
            color={palette[c]}
          >
            {t(c)}
          </Box>
        ))}
      </Box>
      <Box style={{ width: 400 }}>
        {(Object.keys(gray) as Array<any>).map((c) => (
          <Box
            key={c}
            p={2}
            m={2}
            style={{ backgroundColor: `var(--bs-${c})` }}
            color={gray[c]}
          >
            {t(c)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default config;
