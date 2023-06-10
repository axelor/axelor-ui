import { useTranslation } from "react-i18next";
import { Box } from "../box/box";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../table";

const config = {
  component: Box,
  title: "System/Colors",
};

function Swatch({
  title,
  description,
  variables,
  border,
}: {
  title: string;
  description: string | JSX.Element;
  variables: Record<string, boolean>;
  border?: boolean;
}) {
  const vars = Object.entries(variables);
  return (
    <>
      {vars.map(([name, rgb], i) => {
        const isText = name.includes("-text");
        const isBorder = name.includes("-border");
        const isBlock = !isText && !isBorder;
        return (
          <TableRow key={name}>
            {i === 0 && (
              <TableCell rowSpan={vars.length}>
                <strong>{title} —</strong> {description}
              </TableCell>
            )}
            <TableCell>
              {isBlock && (
                <Box
                  p={3}
                  border={border}
                  rounded={2}
                  style={{ backgroundColor: `var(${name})` }}
                >
                  &nbsp;
                </Box>
              )}
              {isBorder && (
                <Box
                  p={3}
                  rounded={2}
                  style={{ border: `5px solid var(${name})` }}
                >
                  &nbsp;
                </Box>
              )}
              {isText && (
                <Box
                  as="h5"
                  py={3}
                  fontWeight="bold"
                  style={{ color: `var(${name})` }}
                >
                  Text
                </Box>
              )}
            </TableCell>
            <TableCell>
              <code>{name}</code>
              {rgb && <br />}
              {rgb && <code>{name}-rgb</code>}
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}

export const System = () => {
  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell as="th" style={{ width: 340 }}>
              Description
            </TableCell>
            <TableCell as="th" style={{ width: 200 }}>
              Swatch
            </TableCell>
            <TableCell as="th">Variables</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <Swatch
            title="Body"
            description="Default foreground (color) and background, including components."
            variables={{ "--bs-body-color": true, "--bs-body-bg": true }}
            border
          />
          <Swatch
            title="Secondary"
            description={
              <>
                Use the <code>color</code> option for lighter text. Use the{" "}
                <code>bg</code> option for dividers and to indicate disabled
                component states.
              </>
            }
            border
            variables={{
              "--bs-secondary-color": true,
              "--bs-secondary-bg": true,
            }}
          />
          <Swatch
            title="Tertiary"
            description={
              <>
                Use the <code>color</code> option for even lighter text. Use the{" "}
                <code>bg</code> option to style backgrounds for hover states,
                accents, and wells.
              </>
            }
            border
            variables={{
              "--bs-tertiary-color": true,
              "--bs-tertiary-bg": true,
            }}
          />
          <Swatch
            title="Emphasis"
            description={
              <>For higher contrast text. Not applicable for backgrounds.</>
            }
            border
            variables={{
              "--bs-emphasis-color": true,
            }}
          />
          <Swatch
            title="Border"
            description={
              <>
                For component borders, dividers, and rules. Use
                <code>--bs-border-color-translucent</code> to blend with
                backgrounds with an <code>rgba()</code> value.
              </>
            }
            variables={{
              "--bs-border-color": true,
            }}
          />
          <Swatch
            title="Primary"
            description={
              <>
                Main theme color, used for hyperlinks, focus styles, and
                component and form active states.
              </>
            }
            variables={{
              "--bs-primary": true,
              "--bs-primary-bg-subtle": false,
              "--bs-primary-border-subtle": false,
              "--bs-primary-text-emphasis": false,
            }}
          />
          <Swatch
            title="Success"
            description={
              <>
                Theme color used for positive or successful actions and
                information.
              </>
            }
            variables={{
              "--bs-success": true,
              "--bs-success-bg-subtle": false,
              "--bs-success-border-subtle": false,
              "--bs-success-text-emphasis": false,
            }}
          />
          <Swatch
            title="Danger"
            description={
              <>Theme color used for errors and dangerous actions.</>
            }
            variables={{
              "--bs-danger": true,
              "--bs-danger-bg-subtle": false,
              "--bs-danger-border-subtle": false,
              "--bs-danger-text-emphasis": false,
            }}
          />
          <Swatch
            title="Warning"
            description={
              <>Theme color used for non-destructive warning messages.</>
            }
            variables={{
              "--bs-warning": true,
              "--bs-warning-bg-subtle": false,
              "--bs-warning-border-subtle": false,
              "--bs-warning-text-emphasis": false,
            }}
          />
          <Swatch
            title="Info"
            description={
              <>Theme color used for neutral and informative content.</>
            }
            variables={{
              "--bs-info": true,
              "--bs-info-bg-subtle": false,
              "--bs-info-border-subtle": false,
              "--bs-info-text-emphasis": false,
            }}
          />
          <Swatch
            title="Light"
            description={
              <>Additional theme option for less contrasting colors.</>
            }
            variables={{
              "--bs-light": true,
              "--bs-light-bg-subtle": false,
              "--bs-light-border-subtle": false,
              "--bs-light-text-emphasis": false,
            }}
          />
          <Swatch
            title="Dark"
            description={
              <>Additional theme option for higher contrasting colors.</>
            }
            variables={{
              "--bs-dark": true,
              "--bs-dark-bg-subtle": false,
              "--bs-dark-border-subtle": false,
              "--bs-dark-text-emphasis": false,
            }}
          />
        </TableBody>
      </Table>
    </Box>
  );
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
};

export const Theme = () => {
  const { t } = useTranslation();
  return (
    <Box style={{ width: 400 }}>
      {(Object.keys(colors) as Array<any>).map((c) => (
        <Box key={c} p={3} m={3} rounded bgColor={c} color={colors[c]}>
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
            p={3}
            m={3}
            rounded
            border={c === "white"}
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
            p={3}
            m={3}
            rounded
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
