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
import { useControlled } from "../hooks";

import styles from "./select.module.scss";

export type SelectValue<Type, Multiple extends boolean> =
  | (Multiple extends true ? Type[] : Type)
  | null
  | undefined;

export type SelectIcon = {
  key?: string | number;
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export interface SelectOptionProps<Type> {
  option: Type;
  active?: boolean;
}

export interface SelectCustomOption {
  key: string | number;
  title: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface SelectProps<Type, Multiple extends boolean> {
  className?: string;
  placeholder?: string;
  options: Type[];
  autoFocus?: boolean;
  autoComplete?: boolean;
  multiple?: Multiple;
  value?: SelectValue<Type, Multiple>;
  defaultValue?: SelectValue<Type, Multiple>;
  open?: boolean;
  toggleIcon?: SelectIcon | false;
  clearIcon?: SelectIcon | false;
  icons?: SelectIcon[];
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  customOptions?: SelectCustomOption[];
  onChange?: (value: SelectValue<Type, Multiple>) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onInputChange?: (value: string) => void;
  optionKey: (option: Type) => string | number;
  optionLabel: (option: Type) => string;
  optionEqual: (option: Type, value: Type) => boolean;
  optionMatch?: (option: Type, text: string) => boolean;
  renderOption?: (props: SelectOptionProps<Type>) => JSX.Element | null;
  renderValue?: (option: SelectOptionProps<Type>) => JSX.Element | null;
}

function isEmpty(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim().length === 0) ||
    (Array.isArray(value) && value.length === 0)
  );
}

export const Select = forwardRef(function Select<
  Type,
  Multiple extends boolean,
>(props: SelectProps<Type, Multiple>, ref: React.ForwardedRef<HTMLDivElement>) {
  const {
    placeholder,
    autoFocus,
    autoComplete = true,
    multiple,
    className,
    options,
    customOptions,
    icons = [],
    required,
    readOnly,
    disabled,
    invalid,
    optionKey,
    optionLabel,
    optionEqual,
    optionMatch,
    onOpen,
    onClose,
    onChange,
    onInputChange,
    renderOption,
    renderValue,
  } = props;

  const [value, setValue] = useControlled({
    name: "Select",
    prop: "value",
    state: props.value,
    defaultState: props.defaultValue,
  });

  const [open, setOpen] = useControlled({
    name: "Select",
    prop: "open",
    state: props.open,
  });

  const [inputValue, setInputValue] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const valueRef = useRef<SelectValue<Type, Multiple>>();

  useEffect(() => {
    if (valueRef.current === value) return;
    if (value && autoComplete && !multiple) {
      setInputValue(optionLabel(value as Type));
    } else {
      setInputValue("");
    }
    valueRef.current = value;
  }, [autoComplete, multiple, optionLabel, value]);

  const handleOpen = useCallback(() => {
    if (open) return;
    setOpen(true);
    onOpen?.();
  }, [onOpen, open, setOpen]);

  const handleClose = useCallback(() => {
    if (open) {
      setOpen(false);
      onClose?.();
    }
  }, [onClose, open, setOpen]);

  useEffect(() => {
    if (open) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [onClose, onOpen, open]);

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
    (value: SelectValue<Type, Multiple>, option: Type) => {
      const selected = [value].flat().filter(Boolean) as Type[];
      const found = selected.find((item) => optionEqual(item, option));
      if (found) {
        return value;
      }
      const selection = multiple ? [...selected, option] : option;
      return selection as SelectValue<Type, Multiple>;
    },
    [multiple, optionEqual],
  );

  const updateValue = useCallback(
    (option: Type | null) => {
      const next = option ? acceptOption(value, option) : null;
      const text = multiple ? "" : option ? optionLabel(option) : "";

      setActiveIndex(null);
      setInputValue(text);
      handleClose();

      inputRef.current?.focus();

      if (next !== value) {
        setValue(next);
        onChange?.(next);
      }
    },
    [
      acceptOption,
      handleClose,
      multiple,
      onChange,
      optionLabel,
      setValue,
      value,
    ],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      setInputValue(text);
      onInputChange?.(text);
      if (text) {
        handleOpen();
        setActiveIndex(0);
      } else if (!multiple) {
        updateValue(null);
      }
    },
    [handleOpen, multiple, onInputChange, updateValue],
  );

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && activeIndex !== null) {
        event.preventDefault();
        const option = items[activeIndex];
        if (option) {
          updateValue(option);
        } else {
          // custom option
          const ref = listRef.current[activeIndex];
          if (ref) {
            handleClose();
            ref.click();
          }
        }
      }

      // delete the last item from the selection
      if (multiple && event.key === "Backspace") {
        if (inputValue) return;
        if (Array.isArray(value)) {
          const items = value.slice(0, value.length - 1);
          const next = items.length
            ? (items as SelectValue<Type, Multiple>)
            : null;
          setValue(next);
          onChange?.(next);
        }
      }
    },
    [
      activeIndex,
      handleClose,
      inputValue,
      items,
      multiple,
      onChange,
      setValue,
      updateValue,
      value,
    ],
  );

  const handleRootKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (autoComplete) return;
      if (event.target !== event.currentTarget) return;
      if (event.key === "Enter" && activeIndex !== null) {
        event.preventDefault();
        const option = items[activeIndex];
        if (option) {
          updateValue(option);
        }
      }
    },
    [activeIndex, autoComplete, items, updateValue],
  );

  const rootRef = useMergeRefs([ref, refs.setReference]);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggleClick = useCallback(() => {
    if (readOnly || disabled) return;
    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [disabled, handleClose, handleOpen, open, readOnly]);

  const handleRootClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || event.isDefaultPrevented()) return;
      if (inputRef.current) inputRef.current.focus();
      if (readOnly) return;
      if (
        event.target === event.currentTarget ||
        event.target === inputRef.current ||
        event.target === contentRef.current ||
        contentRef.current?.contains(event.target as Node)
      ) {
        handleToggleClick();
      }
    },
    [disabled, handleToggleClick, readOnly],
  );

  const handleClearClick = useCallback(() => {
    if (readOnly || disabled) return;
    updateValue(null);
  }, [disabled, readOnly, updateValue]);

  const toggleIcon = useMemo(() => {
    if (props.toggleIcon === false) return false;
    return {
      icon: <MaterialIcon icon={open ? "arrow_drop_up" : "arrow_drop_down"} />,
      onClick: handleToggleClick,
      ...props.toggleIcon,
    };
  }, [props.toggleIcon, open, handleToggleClick]);

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
        <div key={optionKey(item)} className={styles.tag}>
          {!!renderValue && renderValue({ option: item })}
          {!!renderValue || (
            <Badge
              bg="secondary"
              key={optionKey(item)}
              className={styles.badge}
            >
              {optionLabel(item)}
            </Badge>
          )}
        </div>
      );
    });
  }, [optionKey, optionLabel, renderValue, value]);

  const renderSelector = useCallback(() => {
    if (autoComplete) {
      return (
        <input
          ref={inputRef}
          type="text"
          autoFocus={autoFocus}
          className={styles.input}
          value={inputValue}
          readOnly={readOnly || disabled}
          placeholder={isEmpty(value) ? placeholder : undefined}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
      );
    }
    if (multiple) return null;
    if (value) {
      return (
        <div className={styles.value}>
          {!!renderValue && renderValue({ option: value as Type })}
          {!!renderValue || optionLabel(value as Type)}
        </div>
      );
    }
    if (placeholder) {
      return <span className={styles.placeholder}>{placeholder}</span>;
    }
    return null;
  }, [
    autoComplete,
    multiple,
    value,
    autoFocus,
    inputValue,
    readOnly,
    disabled,
    placeholder,
    handleInputChange,
    handleInputKeyDown,
    renderValue,
    optionLabel,
  ]);

  const canClear =
    clearIcon &&
    [value].flat().filter(Boolean).length > 0 &&
    !readOnly &&
    !disabled;

  const notValid = useMemo(() => {
    if (invalid) return true;
    if (value) return false;
    if (required) return true;
    return false;
  }, [required, invalid, value]);

  return (
    <>
      <div
        className={clsx(className, styles.select, {
          [styles.open]: open,
          [styles.required]: required,
          [styles.readonly]: readOnly,
          [styles.disabled]: disabled,
          [styles.invalid]: notValid,
        })}
        autoFocus={autoComplete ? undefined : autoFocus}
        aria-disabled={disabled ? true : undefined}
        aria-readonly={readOnly ? true : undefined}
        {...getReferenceProps({
          ref: rootRef,
          tabIndex: autoComplete || disabled ? undefined : 0,
          onClick: handleRootClick,
          onKeyDown: handleRootKeyDown,
        })}
      >
        <div ref={contentRef} className={styles.content}>
          {multiple && renderMultiple()}
          {renderSelector()}
        </div>
        <div className={styles.actions}>
          {canClear && (
            <div
              className={clsx(styles.action, styles.clearIcon)}
              onClick={clearIcon.onClick}
            >
              {clearIcon.icon}
            </div>
          )}
          {icons.map((icon, index) => (
            <div
              key={icon.key ?? index}
              data-index={index}
              className={clsx(styles.action)}
              onClick={icon.onClick}
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
                    onClick() {
                      updateValue(item);
                    },
                  })}
                  active={activeIndex === index}
                >
                  {!!renderOption || optionLabel(item)}
                  {!!renderOption &&
                    renderOption({
                      option: item,
                      active: activeIndex === index,
                    })}
                </SelectItem>
              ))}
              {customOptions?.map((item, index) => (
                <SelectItem
                  {...getItemProps({
                    ref(node) {
                      listRef.current[items.length + index] = node;
                    },
                    onClick(event) {
                      handleClose();
                      setActiveIndex(null);
                      item.onClick?.(event);
                    },
                  })}
                  key={item.key}
                  active={activeIndex === items.length + index}
                >
                  {item.title}
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

type SelectItemProps = React.HTMLProps<HTMLDivElement> & {
  active: boolean;
};

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectOption(props, ref) {
    const { active, children, className, ...rest } = props;
    const id = useId();
    return (
      <div
        ref={ref}
        role="option"
        id={id}
        aria-selected={active}
        className={clsx(className, styles.option, { [styles.active]: active })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
