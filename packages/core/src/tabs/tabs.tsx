import React from 'react';
import { OverflowList, OverflowListTypes } from '../overflow-list';

export interface TabsProps {
  children: React.ReactElement[];
  value?: number;
  onTabChange?: (value: number) => void;
  scrollLeft?: React.ReactElement;
  scrollRight?: React.ReactElement;
}

const RESIZE_DELAY = 50;

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

  React.useEffect(() => {
    if (!overflowListRef) return;
    let timer: any;

    const clear = () => clearTimeout(timer);
    const resizer = (args: any) =>
      window.requestAnimationFrame(() => {
        clear();
        timer = setTimeout(() => {
          const buttonWidth = 32;
          const [scrollLeft, tabs, scrollRight] = overflowListRef.children;
          const tabsWidth = Array.from(tabs.children).reduce(
            (total, tab) =>
              total + (tab ? (tab as HTMLElement).offsetWidth : 0) || 0,
            0
          );
          const show =
            tabsWidth + buttonWidth * 2 >= overflowListRef.offsetWidth;

          (scrollLeft as HTMLElement).style.setProperty(
            'display',
            show ? 'flex' : 'none',
            'important'
          );
          (scrollRight as HTMLElement).style.setProperty(
            'display',
            show ? 'flex' : 'none',
            'important'
          );
        }, RESIZE_DELAY);
      });

    const resizeObserver = new ResizeObserver(resizer);
    resizeObserver.observe(overflowListRef);

    return () => {
      clear();
      resizeObserver.disconnect();
    };
  }, [overflowListRef, children.length]);

  return (
    <OverflowList
      ref={setOverflowListRef}
      d="flex"
      scrollable
      items={
        React.Children.map(children, (element, index) =>
          React.cloneElement(element, {
            active: index === activeTab,
            index,
            className: tabClassName,
            onClick: selectTab,
          })
        ) as any
      }
      renderButton={(
        type: OverflowListTypes.OverflowListButtonType,
        props: any
      ) => {
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
