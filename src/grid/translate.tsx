import React, { useCallback } from "react";
import * as TYPES from "./types";

const TranslateContext = React.createContext((str: TYPES.GridLabel) =>
  String(str),
);

export function TranslateProvider({
  labels,
  children,
}: {
  children: React.ReactNode;
  labels?: TYPES.GridProps["labels"];
}) {
  const t = useCallback(
    (key: TYPES.GridLabel) => labels?.[key] || key,
    [labels],
  );
  return (
    <TranslateContext.Provider value={t}>{children}</TranslateContext.Provider>
  );
}

export function useTranslation() {
  return React.useContext(TranslateContext);
}
