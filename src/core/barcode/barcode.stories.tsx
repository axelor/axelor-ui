import { Barcode } from "./barcode";

const config = {
  component: Barcode,
  title: "Components/Barcode",
};

export const Basic = () => <Barcode value="Code 128" />;

export const EAN13 = () => <Barcode value="3330123456789" format="EAN13" />;

export const EAN8 = () => <Barcode value="96385074" format="EAN8" />;

export const UPC = () => <Barcode value="123456789999" format="UPC" />;

export const CODE39 = () => <Barcode value="CODE39 Barcode" format="CODE39" />;

export const ITF14 = () => <Barcode value="12345678901231" format="ITF14" />;

export const codabar = () => (
  <Barcode
    value="1234567890"
    format="Codabar"
    backgroundColor="#ccffff"
    lineColor="red"
    height={50}
    barWidth={3}
  />
);

export default config;
