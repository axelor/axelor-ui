import QRCode from "qrcode";
import { useEffect, useRef } from "react";

import { Box, BoxProps } from "../box";
import { StyledComponentProps } from "../styled";
import { StyleProps } from "../system";

type QrCodeProps = {
  /**
   * The QrCode value
   */
  value?: string;
  /**
   * The QrCode height in px.
   * @default 140
   */
  height?: number;
} & StyledComponentProps<"canvas", BoxProps & StyleProps>;

export const QrCode = (props: QrCodeProps) => {
  const { value, height = 140, ...rest } = props;

  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: height,
        margin: 0,
      });
    }
  }, [value, height]);

  return <Box as="canvas" ref={canvasRef} {...rest} />;
};
