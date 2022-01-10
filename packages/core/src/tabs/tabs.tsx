import React from 'react';
import { OverflowList } from '../overflow-list';

export interface TabsProps {
  children: React.ReactElement[];
  value?: number;
  onTabChange?: (value: number) => void;
  scrollLeft?: React.ReactElement;
  scrollRight?: React.ReactElement;
}

export function Tabs({
  children,
  value,
  onTabChange,
  scrollLeft,
  scrollRight,
}: TabsProps) {
  const [overflowListRef, setOverflowListRef] =
    React.useState<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = React.useState(value);

  const tabClassName = 'tab';

  function selectTab(e: React.SyntheticEvent, index: number) {
    setActiveTab(index);
    onTabChange && onTabChange(index);
  }

  React.useEffect(() => {
    setActiveTab(value);
  }, [value]);

  React.useEffect(() => {
    if (overflowListRef && activeTab !== undefined && activeTab >= 0) {
      const target = overflowListRef.querySelector(
        `.${tabClassName}:nth-child(${activeTab + 1})`
      ) as HTMLElement;
      const parent = target && target.parentElement;
      if (target && parent) {
        const total = target.offsetLeft + target.offsetWidth;
        const hasLeftScroll = target.offsetLeft < parent.scrollLeft;
        const hasRightScroll = total > parent.scrollLeft + parent.offsetWidth;

        if (hasLeftScroll || hasRightScroll) {
          const scrollX = hasLeftScroll
            ? target.offsetLeft
            : total - parent.offsetWidth;
          scrollX >= 0 && (parent.scrollLeft = scrollX);
        }
      }
    }
  }, [overflowListRef, tabClassName, activeTab]);

  return (
    <OverflowList
      ref={setOverflowListRef}
      d="flex"
      scrollable
      items={React.Children.map(children, (element, index) =>
        React.cloneElement(element, {
          active: index === activeTab,
          index,
          className: tabClassName,
          onClick: selectTab,
        })
      )}
      renderButton={(type, props) => {
        if (type === 'scroll-left' && scrollLeft) {
          return React.cloneElement(scrollLeft, props);
        }
        if (type === 'scroll-right' && scrollRight) {
          return React.cloneElement(scrollRight, props);
        }
        return null;
      }}
    />
  );
}
