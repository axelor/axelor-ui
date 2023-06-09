import { forwardRef } from "react";
import { ClassValue } from "../clsx";
import { useClasses } from "../styles";

type BlockRef<T extends React.ElementType> =
  React.ComponentPropsWithRef<T>["ref"];

export type BlockProps<T extends React.ElementType> = {
  as?: T;
  classes?: ClassValue;
} & React.ComponentPropsWithoutRef<T>;

export type BlockComponent<T extends React.ElementType> = <
  As extends React.ElementType = T
>(
  props: BlockProps<As> & { ref?: BlockRef<As> }
) => JSX.Element | null;

const BlockElement = "div" as const;

export const Block = forwardRef(function BlockComponent<
  T extends React.ElementType
>({ as, classes, className, ...props }: BlockProps<T>, ref: BlockRef<T>) {
  const cls = useClasses(className, classes);
  const Component = as || BlockElement;
  return <Component {...props} className={cls} ref={ref} />;
}) as unknown as BlockComponent<typeof BlockElement>;
