import { ComponentProps, ComponentType, forwardRef, useState } from "react";
import { Box, useClassNames } from "..";
import styled from "../styled";

import styles from "./input.module.scss";

export interface InputProps {
  intermediate?: boolean;
  invalid?: boolean;
  large?: boolean;
  small?: boolean;
}

const formClass = (type: string) => {
  switch (type) {
    case "checkbox":
    case "radio":
      return "form-check-input";
    case "range":
      return "form-range";
    case "color":
      return "form-control-color";
    default:
      return "form-control";
  }
};

const inputClassNames = (
  invalid?: boolean,
  large?: boolean,
  small?: boolean,
) => ({
  [styles.invalid]: invalid,
  [styles["input-sm"]]: small,
  [styles["input-lg"]]: large,
  "form-control-sm": small,
  "form-control-lg": large,
});

export const Input = styled.input<InputProps>(
  ({ type = "text", invalid, large, small }) => [
    styles.input,
    formClass(type),
    inputClassNames(invalid, large, small),
  ],
  ({ type = "text" }) => ({ type }),
);

type AdornedInputProps = ComponentProps<typeof Input> & {
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
  InputComponent?: ComponentType;
};

const AdornedInputComponent = forwardRef<HTMLInputElement, AdornedInputProps>(
  (props, ref) => {
    const {
      startAdornment,
      endAdornment,
      InputComponent = Input,
      type = "text",
      invalid,
      large,
      small,
      className,
      ...rest
    } = props;

    // StyleProps, except TextProps
    const {
      bg,
      bgColor,
      bgGradient,
      border,
      borderTop,
      borderBottom,
      borderStart,
      borderEnd,
      borderWidth,
      borderColor,
      borderTranslucent,
      rounded,
      roundedTop,
      roundedBottom,
      roundedStart,
      roundedEnd,
      opacity,
      shadow,
      dropShadow,
      userSelect,
      pointerEvents,
      visible,
      d,
      display,
      print,
      verticalAlign,
      overflow,
      float,
      w,
      h,
      maxW,
      maxH,
      vw,
      vh,
      minVW,
      minVH,
      pos,
      position,
      edge,
      m,
      mt,
      mb,
      ms,
      me,
      mx,
      my,
      p,
      pt,
      pb,
      ps,
      pe,
      px,
      py,
      flex,
      flexBasis,
      flexDirection,
      flexFlow,
      flexGrow,
      flexShrink,
      flexWrap,
      order,
      justifyContent,
      alignContent,
      alignItems,
      alignSelf,
      placeContent,
      placeItems,
      rowGap,
      columnGap,
      gap,
      g,
      gridGap,
      gridRowGap,
      gridColumnGap,
      gridRow,
      gridColumn,
      gridRowStart,
      gridColumnStart,
      gridRowEnd,
      gridColumnEnd,
      gridAutoRows,
      gridAutoColumns,
      gridAutoFlow,
      gridTemplate,
      gridTemplateRows,
      gridTemplateColumns,
      gridTemplateAreas,
      gridArea,
      ...inputProps
    } = rest;

    const classNames = useClassNames();
    const [focused, setFocused] = useState(false);

    return (
      <Box
        className={classNames(
          styles.adorned,
          styles.input,
          focused && styles.focus,
          formClass(type),
          inputClassNames(invalid, large, small),
          className,
        )}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        bg={bg}
        bgColor={bgColor}
        bgGradient={bgGradient}
        border={border}
        borderTop={borderTop}
        borderBottom={borderBottom}
        borderStart={borderStart}
        borderEnd={borderEnd}
        borderWidth={borderWidth}
        borderColor={borderColor}
        borderTranslucent={borderTranslucent}
        rounded={rounded}
        roundedTop={roundedTop}
        roundedBottom={roundedBottom}
        roundedStart={roundedStart}
        roundedEnd={roundedEnd}
        opacity={opacity}
        shadow={shadow}
        dropShadow={dropShadow}
        userSelect={userSelect}
        pointerEvents={pointerEvents}
        visible={visible}
        d={d}
        display={display}
        print={print}
        verticalAlign={verticalAlign}
        overflow={overflow}
        float={float}
        w={w}
        h={h}
        maxW={maxW}
        maxH={maxH}
        vw={vw}
        vh={vh}
        minVW={minVW}
        minVH={minVH}
        pos={pos}
        position={position}
        edge={edge}
        m={m}
        mt={mt}
        mb={mb}
        ms={ms}
        me={me}
        mx={mx}
        my={my}
        p={p}
        pt={pt}
        pb={pb}
        ps={ps}
        pe={pe}
        px={px}
        py={py}
        flex={flex}
        flexBasis={flexBasis}
        flexDirection={flexDirection}
        flexFlow={flexFlow}
        flexGrow={flexGrow}
        flexShrink={flexShrink}
        flexWrap={flexWrap}
        order={order}
        justifyContent={justifyContent}
        alignContent={alignContent}
        alignItems={alignItems}
        alignSelf={alignSelf}
        placeContent={placeContent}
        placeItems={placeItems}
        rowGap={rowGap}
        columnGap={columnGap}
        gap={gap}
        g={g}
        gridGap={gridGap}
        gridRowGap={gridRowGap}
        gridColumnGap={gridColumnGap}
        gridRow={gridRow}
        gridColumn={gridColumn}
        gridRowStart={gridRowStart}
        gridColumnStart={gridColumnStart}
        gridRowEnd={gridRowEnd}
        gridColumnEnd={gridColumnEnd}
        gridAutoRows={gridAutoRows}
        gridAutoColumns={gridAutoColumns}
        gridAutoFlow={gridAutoFlow}
        gridTemplate={gridTemplate}
        gridTemplateRows={gridTemplateRows}
        gridTemplateColumns={gridTemplateColumns}
        gridTemplateAreas={gridTemplateAreas}
        gridArea={gridArea}
      >
        {startAdornment && (
          <div className={styles.adornment}>{startAdornment}</div>
        )}
        <InputComponent
          ref={ref}
          type={type}
          {...inputProps}
          bg={bg}
          bgColor={bgColor}
          bgGradient={bgGradient}
        />
        {endAdornment && <div className={styles.adornment}>{endAdornment}</div>}
      </Box>
    );
  },
);

export const AdornedInput = forwardRef<HTMLInputElement, AdornedInputProps>(
  (props, ref) => {
    const {
      startAdornment,
      endAdornment,
      InputComponent = Input,
      ...inputProps
    } = props;

    return startAdornment || endAdornment ? (
      <AdornedInputComponent {...props} ref={ref} />
    ) : (
      <InputComponent {...inputProps} ref={ref} />
    );
  },
);
