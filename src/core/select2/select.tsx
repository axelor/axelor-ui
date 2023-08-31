import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  size,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
} from "@floating-ui/react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MaterialIcon } from "../../icons/material-icon";
import { Badge } from "../badge";
import { clsx } from "../clsx";

import styles from "./select.module.scss";

export type OptionType<Type, Multiple extends boolean> =
  | (Multiple extends true ? Type[] : Type)
  | null
  | undefined;

export type SelectIcon = {
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export interface SelectProps<Type, Multiple extends boolean> {
  className?: string;
  options: Type[];
  multiple?: Multiple;
  value?: OptionType<Type, Multiple>;
  open?: boolean;
  toggleIcon?: SelectIcon | false;
  clearIcon?: SelectIcon | false;
  icons?: SelectIcon[];
  onChange?: (
    event: React.SyntheticEvent,
    value: OptionType<Type, Multiple>,
  ) => void;
  onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
  optionKey: (option: Type) => string | number;
  optionLabel: (option: Type) => string;
  optionEqual: (option: Type, value: Type) => boolean;
  optionMatch?: (option: Type, text: string) => boolean;
}

function useValue<T>(initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    setValue(initial);
  }, [initial]);
  return [value, setValue] as const;
}

export const Select = forwardRef(function Select<
  Type,
  Multiple extends boolean,
>(props: SelectProps<Type, Multiple>, ref: React.ForwardedRef<HTMLDivElement>) {
  const {
    multiple,
    className,
    options,
    icons = [],
    optionKey,
    optionLabel,
    optionEqual,
    optionMatch,
    onChange,
    onInputChange,
  } = props;

  const [value, setValue] = useValue(props.value);
  const [open, setOpen] = useValue(props.open ?? false);

  const [inputValue, setInputValue] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { refs, floatingStyles, context } = useFloating<HTMLDivElement>({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      flip({ padding: 10 }),
      size({
        apply({ rects, availableHeight, elements }) {
          const width = rects.reference.width;
          const height = Math.min(350, availableHeight);
          elements.floating.style.width = `${width}px`;
          elements.floating.style.maxHeight = `${height}px`;
        },
        padding: 10,
      }),
    ],
  });

  const role = useRole(context, { role: "listbox" });
  const dismiss = useDismiss(context);
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, dismiss, listNav],
  );

  const searchOptions = useCallback(
    (option: Type, text: string) =>
      optionLabel(option).toLowerCase().startsWith(text.toLowerCase()),
    [optionLabel],
  );

  const items = useMemo(() => {
    const matches = optionMatch ?? searchOptions;
    return options.filter((option) => matches(option, inputValue.trim()));
  }, [inputValue, optionMatch, options, searchOptions]);

  const acceptOption = useCallback(
    (option: Type) => {
      const selected = [value].flat().filter(Boolean) as Type[];
      const found = selected
        .filter(Boolean)
        .find((x) => optionEqual(x, option));

      if (found) {
        return value;
      }

      const next = multiple
        ? ([...selected, option].filter(Boolean) as OptionType<Type, Multiple>)
        : (option as OptionType<Type, Multiple>);

      return next;
    },
    [multiple, optionEqual, value],
  );

  const updateValue = useCallback(
    (event: React.SyntheticEvent, option: Type) => {
      const selected = acceptOption(option);
      if (multiple) {
        setInputValue("");
      } else {
        setInputValue(optionLabel(option));
      }
      setActiveIndex(null);
      setOpen(false);
      inputRef.current?.focus();
      if (selected !== value) {
        setValue(selected);
        onChange?.(event, selected);
      }
    },
    [acceptOption, multiple, onChange, optionLabel, setOpen, setValue, value],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      setInputValue(text);
      onInputChange?.(event);
      if (text) {
        setOpen(true);
        setActiveIndex(0);
      }
    },
    [onInputChange, setOpen],
  );

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && activeIndex !== null && items[activeIndex]) {
        const option = items[activeIndex];
        updateValue(event, option);
      }

      if (multiple && event.key === "Backspace") {
        if (inputValue) return;
        setValue((prev) => {
          if (Array.isArray(prev)) {
            const next = [...prev];
            next.pop();
            return next as OptionType<Type, Multiple>;
          }
          return prev;
        });
      }
    },
    [activeIndex, inputValue, items, multiple, setValue, updateValue],
  );

  const rootRef = useMergeRefs([ref, refs.setReference]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRootClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleIconClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const index = parseInt(event.currentTarget.dataset.index ?? "-1");
      const icon = icons[index];
      icon?.onClick?.(event);
    },
    [icons],
  );

  const handleToggleClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const handleClearClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      setValue(null);
      setInputValue("");
      onChange?.(event, null);
    },
    [onChange, setValue],
  );

  const toggleIcon = useMemo(() => {
    if (props.toggleIcon === false) return false;
    return {
      icon: <MaterialIcon icon="arrow_drop_down" />,
      onClick: handleToggleClick,
      ...props.toggleIcon,
    };
  }, [props.toggleIcon, handleToggleClick]);

  const clearIcon = useMemo(() => {
    if (props.clearIcon === false) return false;
    return {
      icon: <MaterialIcon icon="close" fontSize="1rem" />,
      onClick: handleClearClick,
      ...props.clearIcon,
    };
  }, [props.clearIcon, handleClearClick]);

  const renderMultiple = useCallback(() => {
    const items = value as Type[] | null;
    return items?.map((item) => {
      return (
        <Badge bg="primary" key={optionKey(item)} className={styles.tag}>
          {optionLabel(item)}
        </Badge>
      );
    });
  }, [optionKey, optionLabel, value]);

  return (
    <>
      <div
        ref={rootRef}
        className={clsx(className, styles.select, {
          [styles.open]: open,
        })}
        onClick={handleRootClick}
      >
        {multiple && renderMultiple()}
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          {...getReferenceProps({
            value: inputValue,
            onChange: handleInputChange,
            onKeyDown: handleInputKeyDown,
          })}
        />
        {clearIcon && (
          <div
            className={clsx(styles.action, styles.clearIcon)}
            onClick={clearIcon.onClick}
          >
            {clearIcon.icon}
          </div>
        )}
        {icons.map((icon, index) => (
          <div
            data-index={index}
            className={clsx(styles.action)}
            onClick={handleIconClick}
          >
            {icon.icon}
          </div>
        ))}
        {toggleIcon && (
          <div
            className={clsx(styles.action, styles.toggleIcon)}
            onClick={toggleIcon.onClick}
          >
            {toggleIcon.icon}
          </div>
        )}
      </div>
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            visuallyHiddenDismiss
          >
            <div
              {...getFloatingProps({
                ref: refs.setFloating,
                className: styles.list,
                style: floatingStyles,
              })}
            >
              {items.map((item, index) => (
                <SelectItem
                  {...getItemProps({
                    key: optionKey(item),
                    ref(node) {
                      listRef.current[index] = node;
                    },
                    onClick(event: React.MouseEvent<HTMLDivElement>) {
                      updateValue(event, item);
                    },
                  })}
                  active={activeIndex === index}
                >
                  {optionLabel(item)}
                </SelectItem>
              ))}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
}) as unknown as <Type, Multiple extends boolean>(
  props: SelectProps<Type, Multiple> & {
    ref?: React.Ref<HTMLDivElement>;
  },
) => React.ReactNode;

interface SelectItemProps {
  children: React.ReactNode;
  active: boolean;
}

const SelectItem = forwardRef<
  HTMLDivElement,
  SelectItemProps & React.HTMLProps<HTMLDivElement>
>(({ children, active, style, className, ...rest }, ref) => {
  const id = useId();
  return (
    <div
      ref={ref}
      role="option"
      id={id}
      aria-selected={active}
      style={style}
      className={clsx(className, styles.option, { [styles.active]: active })}
      {...rest}
    >
      {children}
    </div>
  );
});
