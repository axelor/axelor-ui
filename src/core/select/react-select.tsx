import { useMemo } from "react";
import Select from "react-select";

import { clsx } from "../clsx";

import styles from "./select.module.scss";

export type ReactSelectProps = React.ComponentProps<Select> & {
  invalid?: boolean;
};

const getClass = (
  state: any,
  prop: undefined | string | ((state: any) => string)
) => (typeof prop === "function" ? prop(state) : prop);

export function useReactSelectClassNames({
  invalid,
  classNames,
}: Pick<ReactSelectProps, "invalid" | "classNames">) {
  return useMemo(() => {
    return {
      ...classNames,
      control: (state: any) =>
        clsx(getClass(state, classNames?.control), styles.control, {
          [styles.invalid]: invalid,
          [styles.invalidFocus]: invalid && state.isFocused,
        }),
      menu: (state: any) =>
        clsx(getClass(state, classNames?.menu), styles.menu),
      menuList: (state: any) =>
        clsx(getClass(state, classNames?.menuList), styles.menuList),
      option: (state: any) => {
        return clsx(getClass(state, classNames?.option), styles.option, {
          [styles.optionFocus]: state.isFocused,
        });
      },
      group: (state: any) =>
        clsx(getClass(state, classNames?.group), styles.group),
      groupHeading: (state: any) =>
        clsx(getClass(state, classNames?.groupHeading), styles.groupHeading),
      placeholder: (state: any) =>
        clsx(getClass(state, classNames?.placeholder), styles.placeholder),
      singleValue: (state: any) =>
        clsx(getClass(state, classNames?.singleValue), styles.singleValue),
      multiValue: (state: any) =>
        clsx(getClass(state, classNames?.multiValue), styles.multiValue),
      input: (state: any) =>
        clsx(getClass(state, classNames?.input), styles.input),
    };
  }, [invalid, classNames]);
}

export function ReactSelect({ invalid, ...props }: ReactSelectProps) {
  const classNames = useReactSelectClassNames({
    invalid,
    classNames: props.classNames,
  });
  return <Select {...props} classNames={classNames} />;
}
