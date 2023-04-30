import isPropValid from "@emotion/is-prop-valid";
import { createElement, forwardRef, useMemo } from "react";
import { ClassValue } from "../clsx";
import { useClassNames } from "../styles";
import { StyleProps, useStyleProps } from "../system";

export type Merge<P, O> = O extends Array<any>
  ? P
  : keyof O extends never
  ? P
  : keyof P extends never
  ? O
  : keyof P & keyof O extends never
  ? O & P
  : O & Omit<P, keyof O>;

export type StyledComponentProps<
  C extends React.ElementType,
  P extends {}
> = C extends React.ElementType<infer Q>
  ? Merge<React.ComponentProps<C>, Merge<Q, P>>
  : Merge<React.ComponentProps<C>, P>;

export interface StyledComponent<C extends React.ElementType, P extends {}>
  extends React.FC<StyledComponentProps<C, P>> {
  (props: StyledComponentProps<C, P>): JSX.Element | null;
  <As extends React.ElementType>(
    props: { as: As } & StyledComponentProps<As, P>
  ): JSX.Element | null;
}

export type StyledConfig<P> = (props: P) => ClassValue[] | Partial<P>;

export interface StyledComponentFactory<
  C extends React.ElementType,
  P extends {}
> {
  <O extends {}>(
    ...styles: Array<
      StyledConfig<
        { as?: React.ElementType } & StyledComponentProps<C, Merge<P, O>>
      >
    >
  ): StyledComponent<C, Merge<P, O>>;
}

export type StyledOptions = {
  displayName?: string;
  shouldForwardProp?: (
    name: string,
    isValid: (name: string) => boolean,
    component: React.ElementType | "string"
  ) => boolean;
};

export interface CreateStyled {
  <C extends React.ElementType>(
    component: C,
    options?: StyledOptions
  ): StyledComponentFactory<
    C extends StyledComponent<infer T, any> ? T : C,
    C extends StyledComponent<any, infer P> ? P : StyleProps
  >;
}

const createStyled: CreateStyled =
  (component, { displayName, shouldForwardProp } = {}) =>
  (...styles) => {
    function useStyles(props: any) {
      const classNames = useClassNames();
      return useMemo(() => {
        const classes = [];
        const computed = { ...props };

        for (let fn of styles) {
          let res = fn(computed);
          if (Array.isArray(res)) {
            classes.push(res);
          } else {
            Object.assign(computed, res);
          }
        }

        const className = [computed.className, classNames(classes)]
          .filter(Boolean)
          .join(" ");

        return {
          ...computed,
          className,
        };
      }, [props, classNames]);
    }

    function useElement(inProps: any, ref: any) {
      return useMemo(() => {
        let { as, ...props } = inProps;
        let Component = component;
        if (typeof component === "string") {
          Component = as || component;
          as = undefined;
        }
        const shouldForward = shouldForwardProp
          ? shouldForwardProp
          : (prop: string) =>
              typeof Component !== "string" || isPropValid(prop);

        const result = Object.keys(props)
          .filter((prop) => shouldForward(prop, isPropValid, component))
          .reduce((prev, prop) => {
            prev[prop] = props[prop];
            return prev;
          }, {} as any);

        const attrs = { ...result, as, ref };

        return createElement(Component, attrs);
      }, [inProps, ref]);
    }

    const Styled = forwardRef<any, any>((props, ref) => {
      const attrs = useStyles(props);
      const styled = useStyleProps(attrs);
      const element = useElement(styled, ref);
      return element;
    });

    Styled.displayName = displayName
      ? displayName
      : `Styled(${
          typeof component === "string"
            ? component
            : component.displayName || component.name || "Component"
        })`;

    return Styled as unknown as StyledComponent<any, any>;
  };

/**
 * Create a `forwardRef` wrapper for the given styled component.
 *
 * The returned function accepts a `forwardRef` render function with
 * the signature `(props, ref) => JSX.Element | null`.
 *
 * Example:
 *
 * ```jsx
 * const FancyButton = withStyled(Button)((props, ref) => {
 *   return <Button ref={ref} {...props}/>;
 * });
 * ```
 *
 * @param _ the styled component to wrap
 * @returns function accepting `forwardRef` render function
 */
export const withStyled =
  <C extends StyledComponent<any, any>>(_: C) =>
  <P extends {}>(
    render: (
      props: { as?: React.ElementType } & P & React.ComponentPropsWithoutRef<C>,
      ref: React.Ref<any>
    ) => JSX.Element | null
  ) => {
    return forwardRef<any, any>(render) as unknown as keyof P extends never
      ? C
      : StyledComponent<C, P>;
  };

type Styled = CreateStyled & {
  [K in keyof JSX.IntrinsicElements]: StyledComponentFactory<K, StyleProps>;
};

const styled = new Proxy(createStyled, {
  apply: (target, thisArg, argArray) =>
    Reflect.apply(target, thisArg, argArray),
  get: (target, prop, receiver) =>
    Reflect.has(target, prop)
      ? Reflect.get(target, prop, receiver)
      : typeof prop === "string"
      ? target(prop as any)
      : null,
}) as Styled;

export default styled;
