import * as React from 'react';
import { styleNames } from '../styles';
import { Box } from '../box';
import { Icon } from '../icon';
import cssStyles from './overflow-list.module.css';

export type OverflowScrollListProps = {
  className?: string;
  inverse?: boolean;
  vertical?: boolean;
  children?: React.ReactNode;
  renderButton?: (
    type: 'scroll-left' | 'scroll-right',
    props: React.HTMLAttributes<HTMLElement>
  ) => React.ReactNode;
};

function ScrollStartButton(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <Box d="flex" justifyContent="center" alignItems="center" px={2}>
      <Icon use="chevron-left" {...props} />
    </Box>
  );
}

function ScrollEndButton(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <Box d="flex" justifyContent="center" alignItems="center" px={2}>
      <Icon use="chevron-right" {...props} />
    </Box>
  );
}

export default function OverflowScrollList({
  className,
  vertical,
  children,
  renderButton,
}: OverflowScrollListProps) {
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
      const Button = type === 'left' ? ScrollStartButton : ScrollEndButton;
      element = <Button {...props} />;
    }

    return element;
  }

  return (
    <>
      {renderScrollButton('left', handleScrollStart)}
      <div
        ref={contentRef}
        className={styleNames(
          className,
          cssStyles.content,
          cssStyles.scrollable
        )}
      >
        {children}
      </div>
      {renderScrollButton('right', handleScrollEnd)}
    </>
  );
}
