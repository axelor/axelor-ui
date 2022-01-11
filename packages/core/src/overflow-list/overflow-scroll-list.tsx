import * as React from 'react';
import { ReactComponent as BiChevronLeft } from 'bootstrap-icons/icons/chevron-left.svg';
import { ReactComponent as BiChevronRight } from 'bootstrap-icons/icons/chevron-right.svg';

import { Box } from '../box';
import { Icon } from '../icon';
import cssStyles from './overflow-list.module.css';
import styled, { withStyled } from '../styled';
import { IconProps } from '../icon/icon';

export interface OverflowScrollListProps {
  className?: string;
  inverse?: boolean;
  vertical?: boolean;
  children?: React.ReactNode;
  renderButton?: (
    type: 'scroll-left' | 'scroll-right',
    props: React.HTMLAttributes<HTMLElement>
  ) => React.ReactNode;
}

const Icons: Record<string, IconProps['as']> = {
  'chevron-right': BiChevronRight,
  'chevron-left': BiChevronLeft,
};

const Content = styled.div(() => [cssStyles.content, cssStyles.scrollable]);

const OverflowScrollList = withStyled(Content)<OverflowScrollListProps>(
  (props, ref) => {
    const { vertical, renderButton } = props;
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const clientProp = vertical ? 'clientHeight' : 'clientWidth';
    const scrollProp = vertical ? 'scrollHeight' : 'scrollWidth';
    const contentProp = vertical ? 'scrollTop' : 'scrollLeft';

    function handleScrollStart() {
      const content = contentRef.current;
      if (content) {
        const size = content[clientProp];
        const val = Math.max(0, (content[contentProp] || 0) - size / 2);
        content[contentProp] = val;
      }
    }

    function handleScrollEnd() {
      const content = contentRef.current;
      if (content) {
        const size = content[clientProp];
        const scrollSize = content[scrollProp];
        const maxVal = scrollSize - size;
        const val = Math.min(maxVal, (content[contentProp] || 0) + size / 2);
        content[contentProp] = val;
      }
    }

    function renderScrollButton(type: 'left' | 'right', onClick: () => void) {
      const props = {
        className: cssStyles.dropdownIcon,
        onClick,
      };
      let element = renderButton && renderButton(`scroll-${type}`, props);

      if (!element) {
        element = (
          <Box
            d="flex"
            justifyContent="center"
            alignItems="center"
            px={2}
            {...props}
          >
            <Icon as={Icons[`chevron-${type}`]} />
          </Box>
        );
      }

      return element;
    }

    return (
      <>
        {renderScrollButton('left', handleScrollStart)}
        <Content ref={contentRef} {...props} />
        {renderScrollButton('right', handleScrollEnd)}
      </>
    );
  }
);

export default OverflowScrollList;
