import React from 'react';
import { styleNames } from '../styles';
import cssStyles from './overflow-list.module.css';

export type OverflowScrollListProps = {
  className?: string;
  inverse?: boolean;
  vertical?: boolean;
  children: () => React.ReactNode;
  scrollButtonStart?: (props: any) => React.ReactNode;
  scrollButtonEnd?: (props: any) => React.ReactNode;
};

export default function OverflowScrollList({
  className,
  children,
  vertical,
  scrollButtonStart,
  scrollButtonEnd,
}: OverflowScrollListProps) {
  const contentRef = React.useRef<any>(null);
  const clientProp = vertical ? 'clientHeight' : 'clientWidth';
  const scrollProp = vertical ? 'scrollHeight' : 'scrollWidth';
  const contentProp = vertical ? 'scrollTop' : 'scrollLeft';

  function scrollStart() {
    const content: any = contentRef.current;
    if (content) {
      const size = content[clientProp];
      const val = Math.max(0, (content[contentProp] || 0) - size / 2);
      content[contentProp] = val;
    }
  }

  function scrollEnd() {
    const content: any = contentRef.current;
    if (content) {
      const size = content[clientProp];
      const scrollSize = content[scrollProp];
      const maxVal = scrollSize - size;
      const val = Math.min(maxVal, (content[contentProp] || 0) + size / 2);
      content[contentProp] = val;
    }
  }

  const childrenList = children();

  function renderScrollStart() {
    return (
      scrollButtonStart &&
      scrollButtonStart({
        className: cssStyles.icon,
        onClick: scrollStart,
      })
    );
  }

  function renderScrollEnd() {
    return (
      scrollButtonEnd &&
      scrollButtonEnd({
        className: cssStyles.icon,
        onClick: scrollEnd,
      })
    );
  }

  function renderChildren() {
    return (
      <div
        ref={contentRef}
        className={styleNames(
          className,
          cssStyles.content,
          cssStyles.scrollable
        )}
      >
        {childrenList}
      </div>
    );
  }

  return (
    <>
      {renderScrollStart()}
      {renderChildren()}
      {renderScrollEnd()}
    </>
  );
}
