import BsIcons from 'bootstrap-icons/bootstrap-icons.svg';
import styled, { withStyled } from '../styled';

type SvgIcon = React.FunctionComponent<React.SVGProps<SVGSVGElement>> & {
  title?: string;
};

const IconSize = {
  sm: '.875em',
  lg: '1.33em',
  1: '1em',
  2: '2em',
  3: '3em',
  4: '4em',
  5: '5em',
  6: '6em',
  7: '7em',
  8: '8em',
  9: '9em',
  10: '10em',
} as const;

export interface IconProps {
  use: string | SvgIcon;
  size?: keyof typeof IconSize;
  title?: string;
}

const SvgIcon = styled.svg<IconProps>();

export const Icon = withStyled(SvgIcon)(
  ({ use, title, size = 1, ...props }, ref) => {
    const attrs = {
      ...props,
      strokeWidth: 0,
      stroke: 'currentColor',
      fill: 'currentColor',
      width: IconSize[size],
      height: IconSize[size],
      ref,
    };

    if (typeof use === 'string') {
      const href = `${BsIcons}#${use}`;
      return (
        <SvgIcon {...attrs}>
          <use href={href} />
        </SvgIcon>
      );
    }

    attrs.as = use;

    return <SvgIcon {...attrs} viewBox="0 0 16 16" />;
  }
);
