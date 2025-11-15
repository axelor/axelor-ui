import { QrCode } from "./qr-code";

const config = {
  component: QrCode,
  title: "Components/QrCode",
};

export const Basic = () => (
  <QrCode value="https://axelor.com" height={200} data-testid="qr-code" />
);

export const Location = () => (
  <QrCode
    value="geo:48.83788976232557,2.590417935294357"
    data-testid="qr-code"
  />
);

export default config;
