import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

import { Box } from "../box";

export type BarcodeProps = {
  /**
   * Barcode value
   */
  value?: string;
  /**
   * Barcode format
   * @default CODE128
   */
  format?:
    | "CODE128"
    | "EAN13"
    | "EAN8"
    | "UPC"
    | "CODE39"
    | "ITF14"
    | "Codabar";
  /**
   * Barcode height
   * @default 100
   */
  height?: number;
  /**
   * Bar width in px. Decimal values are accepted
   * @default 2
   */
  barWidth?: number;
  /**
   * Whether to display the value under the barcode
   * @default true
   */
  displayValue?: boolean;
  /**
   * Background of the barcode
   * @default #ffffff
   */
  backgroundColor?: string;
  /**
   * Color of the bars and the text
   * @default #000000
   */
  lineColor?: string;
  /**
   * Function called if barcode is invalid
   */
  onInvalid?: () => void;
};

export const Barcode = (props: BarcodeProps) => {
  const barcodeRef = useRef(null);

  const {
    value,
    format = "CODE128",
    height = 100,
    barWidth = 2,
    displayValue = true,
    backgroundColor = "#ffffff",
    lineColor = "#000000",
    onInvalid,
  } = props;

  useEffect(() => {
    if (value && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, value, {
          height: height,
          width: barWidth,
          format: format === "Codabar" ? "codabar" : format,
          displayValue: displayValue,
          background: backgroundColor,
          lineColor: lineColor,
        });
      } catch (e: unknown) {
        onInvalid?.();
      }
    }
  }, [
    backgroundColor,
    lineColor,
    barWidth,
    displayValue,
    format,
    height,
    value,
    onInvalid,
  ]);

  return <Box as="svg" ref={barcodeRef} maxW={100} h={100} />;
};
