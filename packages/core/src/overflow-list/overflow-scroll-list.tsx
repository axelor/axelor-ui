import * as React from 'react';
import { ReactComponent as BiChevronLeft } from 'bootstrap-icons/icons/chevron-left.svg';
import { ReactComponent as BiChevronRight } from 'bootstrap-icons/icons/chevron-right.svg';

import { Box } from '../box';
import { Icon } from '../icon';
import { OverflowScrollListProps } from './types';
import styled, { withStyled } from '../styled';
import cssStyles from './overflow-list.module.css';
import { useTheme } from '../styles';

function negative(value: string | number) {
  return -1 * Number(value);
}

function getScrollButtonIcon(type: 'right' | 'left', rtl?: boolean) {
  switch (type) {
    case 'right': {
      return rtl ? BiChevronLeft : BiChevronRight;
    }
    case 'left': {
      return rtl ? BiChevronRight : BiChevronLeft;
    }
    default: {
      return () => null;
    }
  }
}

const Content = styled.div(() => [cssStyles.content, cssStyles.scrollable]);

const OverflowScrollList = withStyled(Content)<OverflowScrollListProps>(
  (props, ref) => {
    const { vertical, renderButton } = props;
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const clientProp = vertical ? 'clientHeight' : 'clientWidth';
    const scrollProp = vertical ? 'scrollHeight' : 'scrollWidth';
    const contentProp = vertical ? 'scrollTop' : 'scrollLeft';

    const { dir } = useTheme();
    const rtl = dir === 'rtl';

    function handleScrollStart() {
      const content = contentRef.current;
      if (content) {
        const size = content[clientProp];
        const scroll = content[contentProp];
        const current = scroll ? (rtl ? negative(scroll) : scroll) : 0;
        const val = Math.max(0, current - size / 2);
        content[contentProp] = rtl ? negative(val) : val;
      }
    }

    function handleScrollEnd() {
      const content = contentRef.current;
      if (content) {
        const size = content[clientProp];
        const scrollSize = content[scrollProp];
        const maxVal = scrollSize - size;
        const scroll = content[contentProp];
        const current = scroll ? (rtl ? negative(scroll) : scroll) : 0;
        const val = Math.min(maxVal, current + size / 2);
        content[contentProp] = rtl ? negative(val) : val;
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
            <Icon as={getScrollButtonIcon(type, rtl)} />
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
