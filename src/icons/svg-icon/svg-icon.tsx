import styled from "../../core/styled";

export type SvgIconElement = React.FunctionComponent<
  React.SVGProps<SVGSVGElement>
> & {
  title?: string;
};

const IconSize = {
  sm: ".875em",
  lg: "1.33em",
  1: "1em",
  2: "2em",
  3: "3em",
  4: "4em",
  5: "5em",
  6: "6em",
  7: "7em",
  8: "8em",
  9: "9em",
  10: "10em",
} as const;

export interface SvgIconProps {
  as: SvgIconElement;
  size?: keyof typeof IconSize;
}

export const SvgIcon = styled.svg<SvgIconProps>(({ size = 1 }) => ({
  strokeWidth: 0,
  stroke: "currentColor",
  fill: "currentColor",
  width: IconSize[size],
  height: IconSize[size],
  viewBox: "0 0 16 16",
}));
