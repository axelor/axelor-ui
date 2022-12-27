import React from 'react';
import { useClassNames } from '../core';
import * as TYPES from './types';
import styles from './grid.module.scss';

export interface GridColumnProps {
  data: TYPES.GridColumn;
  index: number;
  className?: string;
  value?: any;
  type?: 'header' | 'footer' | 'body';
  selected?: boolean;
  focus?: boolean;
  renderer?: TYPES.Renderer;
  onUpdate?: TYPES.GridRowProps['onUpdate'];
  onClick?: (
    e: React.SyntheticEvent,
    column: TYPES.GridColumn,
    columnIndex: number
  ) => void;
  children?: React.ReactNode;
}

export function GridColumn(props: GridColumnProps) {
  const { children, className, data, index, selected, renderer, onClick } =
    props;
  const { width, minWidth } = data;
  const ColumnComponent = renderer || 'div';
  const rendererProps = renderer ? props : {};
  const columnRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (selected && columnRef.current) {
      const focusable = columnRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) {
        const timer = setTimeout(() => {
          (focusable as HTMLElement).focus();
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [selected]);

  const classNames = useClassNames();
  const $width = Math.max(width || 0, minWidth || 0);
  return (
    <ColumnComponent
      {...(renderer ? {} : { ref: columnRef })}
      {...rendererProps}
      onClick={e => onClick && onClick(e, data, index)}
      className={classNames(styles.column, className, data.$css, {
        [styles.center]: ['row-checked'].includes(data.type || ''),
        [styles.selected]: selected,
      })}
      style={{ minWidth: $width, width: $width }}
    >
      {children && typeof children === 'object' ? (
        children
      ) : (
        <span>{children}</span>
      )}
    </ColumnComponent>
  );
}
