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
import { useControlled, useRefs } from "../hooks";

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
  disabled?: boolean;
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
  openOnFocus?: boolean | number;
  clearOnBlur?: boolean;
  clearOnEscape?: boolean;
  closeOnSelect?: boolean;
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
  optionEqual?: (option: Type, value: Type) => boolean;
  optionMatch?: (option: Type, text: string) => boolean;
  renderOption?: (props: SelectOptionProps<Type>) => JSX.Element | null;
  renderValue?: (props: SelectOptionProps<Type>) => JSX.Element | null;
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
    openOnFocus,
    clearOnBlur,
    clearOnEscape,
    closeOnSelect = true,
    optionKey,
    optionLabel,
    optionEqual: isOptionEqual,
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
  const [searchValue, setSearchValue] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const valueRef = useRef<SelectValue<Type, Multiple>>();

  const optionEqual = useCallback(
    (a: Type, b: Type) =>
      isOptionEqual?.(a, b) ?? (a === b || optionKey(a) === optionKey(b)),
    [isOptionEqual, optionKey],
  );

  const resetInput = useCallback(() => {
    const text = multiple || isEmpty(value) ? "" : optionLabel(value as Type);
    setInputValue(text);
    setSearchValue("");
    onInputChange?.("");
  }, [multiple, onInputChange, optionLabel, value]);

  useEffect(() => {
    if (valueRef.current !== value) {
      resetInput();
      valueRef.current = value;
    }
  }, [resetInput, value]);

  const searchOptions = useCallback(
    (option: Type, text: string) =>
      optionLabel(option).toLowerCase().startsWith(text.toLowerCase()),
    [optionLabel],
  );

  const items = useMemo(() => {
    const matches = optionMatch ?? searchOptions;
    return options.filter((option) => matches(option, searchValue));
  }, [optionMatch, options, searchOptions, searchValue]);

  const selectedIndex = useMemo(() => {
    const item = Array.isArray(value) ? value[value.length - 1] : value;
    return open && item ? items?.findIndex((x) => optionEqual(x, item)) : -1;
  }, [items, open, optionEqual, value]);

  const handleOpen = useCallback(() => {
    if (open || disabled || readOnly) return;
    setOpen(true);
    onOpen?.();
  }, [disabled, onOpen, open, readOnly, setOpen]);

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
    selectedIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, dismiss, listNav],
  );

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
      setSearchValue("");
      if (closeOnSelect) {
        handleClose();
      }

      inputRef.current?.focus();

      if (next !== value) {
        setValue(next);
        onChange?.(next);
      }
    },
    [
      acceptOption,
      closeOnSelect,
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
      const text = event.target.value;
      setInputValue(text);
      setSearchValue(text);
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
      if (event.key === "Escape" && clearOnEscape) {
        resetInput();
      }
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

      if (open) return;
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        handleOpen();
      }
    },
    [
      activeIndex,
      clearOnEscape,
      handleClose,
      handleOpen,
      inputValue,
      items,
      multiple,
      onChange,
      open,
      resetInput,
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
      if (open) return;
      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        handleOpen();
      }
    },
    [activeIndex, autoComplete, handleOpen, items, open, updateValue],
  );

  const rootRef = useRefs(ref, refs.setReference);
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
      if (openOnFocus) {
        setFocusOnce(false);
        setFocusNow(false);
      }
      if (readOnly) return;
      if (
        event.target === event.currentTarget ||
        event.target === inputRef.current ||
        event.target === contentRef.current ||
        contentRef.current?.contains(event.target as Node)
      ) {
        // keep open if input text is set
        if (autoComplete && inputRef.current?.value) {
          handleOpen();
        } else {
          handleToggleClick();
        }
      }
    },
    [
      autoComplete,
      disabled,
      handleOpen,
      handleToggleClick,
      openOnFocus,
      readOnly,
    ],
  );

  const [focusOnTab, setFocusOnTab] = useState(false);
  const [focusOnce, setFocusOnce] = useState(true);
  const [focusNow, setFocusNow] = useState(false);

  const focusDelay = useMemo(
    () => (typeof openOnFocus === "number" ? openOnFocus : 300),
    [openOnFocus],
  );

  const handleBlur = useCallback(() => {
    setFocusNow(false);
    setFocusOnTab(Boolean(openOnFocus));
    if (clearOnBlur && !open) {
      resetInput();
    }
  }, [clearOnBlur, open, openOnFocus, resetInput]);

  const handleFocus = useCallback(() => {
    if (openOnFocus && focusOnce) {
      setFocusNow(true);
    }
  }, [focusOnce, openOnFocus]);

  const handleRootKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Tab" && focusOnTab) {
        setFocusOnTab(false);
        setFocusNow(true);
      }
    },
    [focusOnTab],
  );

  useEffect(() => {
    if (focusNow) {
      const timer = setTimeout(() => {
        setFocusOnce(false);
        setFocusNow(false);
        handleOpen();
      }, focusDelay);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [focusDelay, focusNow, handleOpen]);

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
          value={inputValue ?? ""}
          readOnly={readOnly || disabled}
          placeholder={
            inputValue || (multiple && !isEmpty(value))
              ? undefined
              : placeholder
          }
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
    placeholder,
    autoFocus,
    inputValue,
    readOnly,
    disabled,
    handleInputChange,
    handleInputKeyDown,
    handleFocus,
    handleBlur,
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
          onKeyUp: handleRootKeyUp,
          onFocus: autoComplete ? undefined : handleFocus,
          onBlur: autoComplete ? undefined : handleBlur,
        })}
      >
        <div ref={contentRef} className={styles.content}>
          {multiple && renderMultiple()}
          {renderSelector()}
        </div>
        <div tabIndex={-1} className={styles.actions} onClick={handleClose}>
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
                  selected={!multiple && selectedIndex === index}
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
                      if (item.disabled) return;
                      handleClose();
                      setActiveIndex(null);
                      item.onClick?.(event);
                    },
                  })}
                  key={item.key}
                  className={clsx({ [styles.disabled]: item.disabled })}
                  disabled={item.disabled}
                  aria-disabled={item.disabled}
                  active={
                    !item.disabled && activeIndex === items.length + index
                  }
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
  selected?: boolean;
};

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectOption(props, ref) {
    const { active, selected, children, className, ...rest } = props;
    const id = useId();
    return (
      <div
        ref={ref}
        role="option"
        id={id}
        aria-selected={active}
        className={clsx(className, styles.option, {
          [styles.active]: active,
          [styles.selected]: selected,
        })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
