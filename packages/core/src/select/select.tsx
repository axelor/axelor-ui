import React from 'react';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';

export type SelectOption = any;

export interface SelectProps {
  className?: string;
  autoFocus?: boolean;
  isMulti?: boolean;
  isClearable?: boolean;
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
}: SelectProps) {
  const isAsync = Boolean(fetchOptions);

  const getOptionLabel = React.useCallback(
    option =>
      typeof optionLabel === 'function'
        ? optionLabel(option)
        : option[optionLabel],
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

  const SelectComponent = isAsync ? AsyncSelect : ReactSelect;

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
      }}
    />
  );
}
