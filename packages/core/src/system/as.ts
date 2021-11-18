import * as React from 'react';

export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export interface OverridableProps<
  T extends React.ElementType = React.ElementType
> {
  as?: T;
}

export type OverridableComponentProps<T extends React.ElementType, P = {}> = P &
  DistributiveOmit<React.ComponentPropsWithRef<T>, keyof P> &
  OverridableProps<T>;

export interface OverridableComponent<T extends React.ElementType, P = {}> {
  <C extends React.ElementType = T>(
    props: OverridableComponentProps<C, P>,
    context?: any
  ): JSX.Element | null;
  displayName?: string;
  propTypes?: React.WeakValidationMap<any>;
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<Omit<P, keyof OverridableProps>>;
}

export function forwardRef<T extends React.ElementType, P>(
  render: React.ForwardRefRenderFunction<any, OverridableComponentProps<T, P>>
) {
  return React.forwardRef(render) as OverridableComponent<T, P>;
}
