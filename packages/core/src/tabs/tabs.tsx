import React from 'react';
import { ReactComponent as BiChevronLeft } from 'bootstrap-icons/icons/chevron-left.svg';
import { ReactComponent as BiChevronRight } from 'bootstrap-icons/icons/chevron-right.svg';

import { Box } from '../box';
import { Icon } from '../icon';
import { OverflowList, OverflowListTypes } from '../overflow-list';
import { useClassNames, useTheme } from '../styles';
import styles from './tabs.module.scss';

export interface TabsProps {
  children: React.ReactElement[];
  value?: number;
  onTabChange?: (value: number) => void;
  scrollLeft?: React.ReactElement;
  scrollRight?: React.ReactElement;
}

const RESIZE_DELAY = 50;

function ScrollButton(props: any) {
  return (
    <Box
      d="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
      {...props}
    />
  );
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
  const [scroll, setScroll] = React.useState(false);
  const isRTL = useTheme().dir === 'rtl';

  const tabClassName = 'tab';

  const selectTab = React.useCallback(
    function selectTab(e: React.SyntheticEvent, index: number) {
      setActiveTab(index);
      onTabChange && onTabChange(index);
    },
    [onTabChange]
  );

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
          const [scrollLeft, tabs, scrollRight] = overflowListRef.children;
          const tabsWidth = Array.from(tabs.children).reduce(
            (total, tab) =>
              total + (tab ? (tab as HTMLElement).offsetWidth : 0) || 0,
            0
          );
          const show =
            tabsWidth +
              (((scrollLeft as HTMLElement).offsetWidth || 0) +
                ((scrollRight as HTMLElement).offsetWidth || 0)) >=
            overflowListRef.offsetWidth;

          setScroll(show);
        }, RESIZE_DELAY);
      });

    const resizeObserver = new ResizeObserver(resizer);
    resizeObserver.observe(overflowListRef);

    return () => {
      clear();
      resizeObserver.disconnect();
    };
  }, [overflowListRef, children.length]);

  const classNames = useClassNames();
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
        const buttonProps = {
          className: classNames(props.className, {
            [styles.hide]: !scroll,
          }),
        };
        if (type === 'scroll-left') {
          if (scrollLeft) {
            return React.cloneElement(scrollLeft, {
              ...props,
              ...buttonProps,
            });
          }
          return (
            <ScrollButton {...props} {...buttonProps}>
              <Icon as={isRTL ? BiChevronRight : BiChevronLeft} />
            </ScrollButton>
          );
        }
        if (type === 'scroll-right') {
          if (scrollRight) {
            return React.cloneElement(scrollRight, {
              ...props,
              ...buttonProps,
            });
          }
          return (
            <ScrollButton {...props} {...buttonProps}>
              <Icon as={isRTL ? BiChevronLeft : BiChevronRight} />
            </ScrollButton>
          );
        }
        return null;
      }}
    />
  );
}
