export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type ReplaceProps<Inner extends React.ElementType, P> = Omit<
  React.ComponentPropsWithRef<Inner>,
  P
> &
  P;

export interface AsProp<As extends React.ElementType = React.ElementType> {
  as?: As;
}

export interface AsComponent<TInitial extends React.ElementType, P = unknown> {
  <As extends React.ElementType = TInitial>(
    props: React.PropsWithChildren<ReplaceProps<As, AsProp<As> & P>>,
    context?: any
  ): React.ReactElement | null;
  propTypes?: any;
  contextTypes?: any;
  defaultProps?: Partial<P>;
  displayName?: string;
}
