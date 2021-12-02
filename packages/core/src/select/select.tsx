import React from 'react';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';

export type SelectOption = any;

export interface SelectProps {
  className?: string;
  autoFocus?: boolean;
  isMulti?: boolean;
  isClearable?: boolean;
  isCreatable?: boolean;
  isDisabled?: boolean;
  isRtl?: boolean;
  isSearchable?: boolean;
  value: any;
  onChange: (value: any) => void;
  onFocus?: (e: React.SyntheticEvent) => void;
  onBlur?: (e: React.SyntheticEvent) => void;
  onKeyDown?: (e: React.SyntheticEvent) => void;
  options?: SelectOption[];
  fetchOptions?: (searchInput: string) => Promise<unknown>;
  optionLabel?: string | ((option: SelectOption) => string);
  optionValue?: string | ((option: SelectOption) => string);
  createOption?: (inputString: string) => React.ReactNode;
  createOptionPosition?: 'first' | 'last';
  onCreate?: (value: SelectOption) => void;
}

export function useDebounce(cb: (...args: any) => any, duration: number) {
  const timer = React.useRef<any>(null);

  const clearTimer = () => timer.current && clearTimeout(timer.current);

  React.useEffect(() => {
    return () => clearTimer();
  }, []);

  return (...args: any) => {
    clearTimer();
    return new Promise(resolve => {
      timer.current = setTimeout(() => resolve(cb(...args)), duration);
    });
  };
}

export function Select({
  className,
  autoFocus,
  isMulti,
  isClearable = true,
  isDisabled = false,
  isRtl = false,
  isCreatable = false,
  isSearchable = true,
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  options,
  fetchOptions,
  optionLabel = 'label',
  optionValue = 'value',
  createOption,
  createOptionPosition = 'last',
  onCreate,
}: SelectProps) {
  const isAsync = Boolean(fetchOptions);

  const getOptionLabel = React.useCallback(
    option => {
      if (option.__isNew__) {
        return option.label;
      }
      return typeof optionLabel === 'function'
        ? optionLabel(option)
        : option[optionLabel];
    },
    [optionLabel]
  );
  const getOptionValue = React.useCallback(
    option =>
      typeof optionValue === 'function'
        ? optionValue(option)
        : option[optionValue],
    [optionValue]
  );
  const fetchOptionsDelay = fetchOptions && useDebounce(fetchOptions, 500);
  const loadOptions = React.useCallback(
    (searchString, callback) => {
      if (fetchOptionsDelay) {
        fetchOptionsDelay(searchString).then(callback);
      }
    },
    [fetchOptionsDelay]
  );

  const SelectComponent = isAsync
    ? isCreatable
      ? AsyncCreatableSelect
      : AsyncSelect
    : isCreatable
    ? CreatableSelect
    : ReactSelect;

  return (
    <SelectComponent
      className={className}
      classNamePrefix="ax-select"
      isDisabled={isDisabled}
      {...(fetchOptions
        ? { defaultOptions: true, loadOptions }
        : {
            options,
          })}
      {...{
        isMulti,
        isRtl,
        isClearable,
        isSearchable,
        autoFocus,
        value,
        onChange,
        onFocus,
        onBlur,
        onKeyDown,
        getOptionLabel,
        getOptionValue,
        ...(isCreatable
          ? {
              formatCreateLabel: createOption,
              createOptionPosition,
              onCreateOption: onCreate,
            }
          : {}),
      }}
    />
  );
}
