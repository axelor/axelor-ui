import React from 'react';
import { SystemProps, makeStyles, omitStyles } from '../system';
import { styleNames } from '../styles';
import OverflowDropdown from './overflow-dropdown';
import OverflowScrollList from './overflow-scroll-list';
import cssStyles from './overflow-list.module.css';

export interface OverflowListProps extends SystemProps {
  scrollable?: boolean;
  inverse?: boolean;
  vertical?: boolean;
  dropdown?: (props: any) => React.ReactNode;
  dropdownButton?: (props: any) => React.ReactNode;
  scrollButtonStart?: (props: any) => React.ReactNode;
  scrollButtonEnd?: (props: any) => React.ReactNode;
  children: (value: { closeOverflowPopup: () => void }) => React.ReactNode;
}

export const OverflowList = React.forwardRef<HTMLDivElement, OverflowListProps>(
  (
    {
      children,
      className,
      scrollable = false,
      inverse = false,
      vertical = false,
      dropdown,
      dropdownButton,
      scrollButtonStart,
      scrollButtonEnd,
      ...props
    },
    ref
  ) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);
    const Component: any = scrollable ? OverflowScrollList : OverflowDropdown;
    return (
      <div
        ref={ref}
        className={styleNames(cssStyles.container, {
          [cssStyles.vertical]: vertical,
        })}
        {...rest}
      >
        <Component
          {...{
            className: styleNames(className, styles),
            inverse,
            vertical,
            children,
            ...(scrollable
              ? {
                  scrollButtonStart,
                  scrollButtonEnd,
                }
              : {
                  dropdown,
                  dropdownButton,
                }),
          }}
        />
      </div>
    );
  }
);
