import React from 'react';
import ReactSelect, {
  components,
  ControlProps,
  IndicatorsContainerProps,
} from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { Box } from '../box';
import selectStyles from './select.module.css';

export type SelectOption = unknown;

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
  actions?: React.ReactNode;
  createOption?: (inputString: string) => React.ReactNode;
  createOptionPosition?: 'first' | 'last';
  onCreate?: (value: SelectOption) => void;
}

const ControlContainer = (props: ControlProps<SelectOption, true>) => {
  const { onMouseDown, onTouchEnd } = props.innerProps;
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (!e.defaultPrevented) {
      onMouseDown && onMouseDown(e);
    }
  }
  return (
    <components.Control
      {...props}
      innerProps={{
        onMouseDown: handleMouseDown,
        onTouchEnd,
      }}
    />
  );
};

const IndicatorsContainer = (
  props: IndicatorsContainerProps<SelectOption, true>
) => {
  function handleMouseDown(e: React.SyntheticEvent) {
    e.preventDefault();
  }
  return (
    <Box d="flex" className={selectStyles.indicators}>
      <Box
        d="flex"
        className={selectStyles.indicatorActions}
        onMouseDown={handleMouseDown}
      >
        {(props.selectProps.components as any)?.actions}
      </Box>
      <components.IndicatorsContainer {...props} />
    </Box>
  );
};

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
  actions,
  optionLabel = 'label',
  optionValue = 'value',
  createOption,
  createOptionPosition = 'last',
  onCreate,
}: SelectProps) {
  const isAsync = Boolean(fetchOptions);
  const [$options, setOptions] = React.useState(options);
  const [inputText, setInputText] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<any>(null);

  const setTimer = React.useCallback(callback => {
    timer.current = setTimeout(callback, 500);
  }, []);

  const clearTimer = React.useCallback(() => {
    timer.current && clearTimeout(timer.current);
  }, []);

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

  const loadOptions = React.useCallback(
    searchString => {
      if (fetchOptions) {
        setLoading(true);
        clearTimer();
        setTimer(async () => {
          try {
            const list = await fetchOptions(searchString);
            setOptions(list as SelectOption[]);
          } finally {
            setLoading(false);
          }
        });
      }
    },
    [fetchOptions, clearTimer]
  );

  const handleFocus = React.useCallback(
    (e: React.SyntheticEvent) => {
      onFocus && onFocus(e);
      loadOptions('');
    },
    [loadOptions, onFocus]
  );

  const handleInputChange = React.useCallback(value => {
    setInputText(value);
  }, []);

  React.useEffect(() => {
    setOptions(options);
  }, [options]);

  React.useEffect(() => {
    inputText && loadOptions(inputText);
  }, [inputText, loadOptions]);

  React.useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const SelectComponent = (isCreatable ? CreatableSelect : ReactSelect) as any;

  return (
    <SelectComponent
      className={className}
      classNamePrefix="ax-select"
      {...{
        options: $options,
        isMulti,
        isDisabled,
        isRtl,
        isClearable,
        isSearchable,
        isLoading: loading,
        autoFocus,
        value,
        onChange,
        onInputChange: handleInputChange,
        onFocus: handleFocus,
        onBlur,
        onKeyDown,
        getOptionLabel,
        getOptionValue,
        allowCreateWhileLoading: false,
        components: actions
          ? { Control: ControlContainer, IndicatorsContainer, actions }
          : {},
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
