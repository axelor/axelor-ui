import React from 'react';
import { Icon, type SvgIcon } from '../icon';
import ReactSelect, {
  components,
  ControlProps,
  IndicatorsContainerProps,
  MenuListProps,
} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Box } from '../box';

import selectStyles from './select.module.scss';
import { useTheme } from '../styles';

export type SelectOption = unknown;

export interface SelectIcon {
  id: string;
  icon: SvgIcon;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

export interface SelectProps {
  className?: string;
  classNamePrefix?: string;
  placeholder?: string;
  autoFocus?: boolean;
  loading?: boolean;
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
  addOnOptions?: SelectOption[];
  fetchOptions?: (searchInput: string) => Promise<unknown>;
  optionLabel?: string | ((option: SelectOption) => string);
  optionValue?: string | ((option: SelectOption) => string);
  icons?: Array<SelectIcon>;
  createOption?: (inputString: string) => React.ReactNode;
  createOptionPosition?: 'first' | 'last';
  onCreate?: (value: SelectOption) => void;
  components?: any;
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

const MenuList = ({ innerProps, ...rest }: MenuListProps) => {
  return (
    <components.MenuList
      {...rest}
      innerProps={{ ...innerProps, ...(rest.isRtl ? { dir: 'rtl' } : {}) }}
    />
  );
};

const IndicatorsContainer = (
  props: IndicatorsContainerProps<SelectOption, true>
) => {
  function handleMouseDown(e: React.SyntheticEvent) {
    const { onMenuClose } = props.selectProps || {};
    onMenuClose && onMenuClose();
    e.preventDefault();
  }
  const icons: SelectIcon[] =
    (props.selectProps.components as any)?.icons || [];
  return (
    icons.length > 0 && (
      <Box
        d="flex"
        className={selectStyles.icons}
        onMouseDown={handleMouseDown}
      >
        {icons.map(icon => (
          <Icon key={icon.id} as={icon.icon} onClick={icon.onClick} />
        ))}
      </Box>
    )
  );
};

export function Select({
  className,
  classNamePrefix,
  autoFocus,
  placeholder,
  isMulti,
  isClearable = true,
  isDisabled = false,
  isRtl,
  isCreatable = false,
  isSearchable = true,
  loading: _loading,
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  options: _options,
  addOnOptions,
  fetchOptions,
  icons,
  optionLabel = 'label',
  optionValue = 'value',
  createOption,
  createOptionPosition = 'last',
  onCreate,
  components,
}: SelectProps) {
  const [options, setOptions] = React.useState(_options);
  const [inputText, setInputText] = React.useState('');
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const mounted = React.useRef(false);
  const timer = React.useRef<any>(null);

  const { dir } = useTheme();
  const rtl = typeof isRtl !== 'undefined' ? isRtl : dir === 'rtl';

  const setTimer = React.useCallback((callback: any, interval = 500) => {
    timer.current = setTimeout(callback, interval);
  }, []);

  const clearTimer = React.useCallback(() => {
    timer.current && clearTimeout(timer.current);
  }, []);

  const getOptionLabel = React.useCallback(
    (option: any) => {
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
    (option: any) =>
      typeof optionValue === 'function'
        ? optionValue(option)
        : option[optionValue],
    [optionValue]
  );

  const loadOptions = React.useCallback(
    (searchString: string) => {
      if (fetchOptions) {
        clearTimer();
        setTimer(async () => {
          try {
            const list = await fetchOptions(searchString);
            setOptions(list as SelectOption[]);
          } finally {
          }
        }, 500);
      }
    },
    [fetchOptions, setTimer, clearTimer]
  );

  const handleFocus = React.useCallback(
    (e: React.SyntheticEvent) => {
      onFocus && onFocus(e);
      loadOptions('');
    },
    [loadOptions, onFocus]
  );

  const handleInputChange = React.useCallback((value: any) => {
    setInputText(value);
  }, []);

  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!(isMenuOpen && e.key === 'Enter')) {
      onKeyDown && onKeyDown(e);
    }
  };

  React.useEffect(() => {
    setOptions(_options);
  }, [_options]);

  React.useEffect(() => {
    mounted.current && loadOptions(inputText);
  }, [inputText, loadOptions]);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimer();
    };
  }, [clearTimer]);

  const SelectComponent = (isCreatable ? CreatableSelect : ReactSelect) as any;
  const hasOption = inputText
    ? (options || []).some(opt =>
        (getOptionLabel(opt) || '')
          .toLowerCase()
          .includes(inputText.toLowerCase())
      )
    : (options || []).length > 0;

  const $options = React.useMemo(() => {
    return [...(options || []), ...(addOnOptions || [])];
  }, [options, addOnOptions]);

  return (
    <SelectComponent
      className={className}
      classNamePrefix={classNamePrefix}
      menuPortalTarget={document.body}
      menuIsOpen={hasOption && isMenuOpen}
      menuPlacement="auto"
      {...{
        options: $options,
        placeholder,
        isMulti,
        isDisabled,
        isRtl: rtl,
        isClearable,
        isSearchable,
        autoFocus,
        value,
        onChange,
        inputValue: inputText,
        onInputChange: handleInputChange,
        onFocus: handleFocus,
        onBlur,
        onKeyDown: handleKeyDown,
        getOptionLabel,
        getOptionValue,
        allowCreateWhileLoading: false,
        closeMenuOnScroll: true,
        openMenuOnClick: true,
        onMenuOpen: handleMenuOpen,
        onMenuClose: handleMenuClose,
        noOptionsMessage: () => '',
        components: {
          Control: ControlContainer,
          IndicatorsContainer,
          icons,
          MenuList,
          ...components,
          MenuList,
        },
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
