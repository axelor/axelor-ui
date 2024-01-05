import React from "react";
import { useClassNames } from "../core";

import { MaterialIcon } from "../icons/material-icon";
import styles from "./grid.module.scss";
import { useTranslation } from "./translate";
import * as TYPES from "./types";
import { useRTL } from "./utils";

export const GridGroupRow = React.memo(function GridGroupRow(
  props: TYPES.GridRowProps,
) {
  const { className, selected, data, index, width, renderer, onClick } = props;
  const { state, record } = data;
  const { title, level, value, total } = record;
  const RowRenderer = renderer || "div";
  const rendererProps = renderer ? props : {};
  const classNames = useClassNames();
  const isRTL = useRTL();
  const t = useTranslation();

  return (
    <RowRenderer
      {...rendererProps}
      className={classNames(styles.row, styles.groupRow, className, {
        [styles.selected]: selected,
      })}
      {...(width && { style: { width } })}
    >
      {new Array(level)
        .fill(0)
        .map((_, ind) =>
          ind !== 0 ? <div key={ind} className={styles.groupSpacer} /> : null,
        )}
      <div
        onClick={(e) => onClick && data && onClick(e as any, data, index)}
        className={styles.groupRowContent}
      >
        <MaterialIcon
          className={styles.groupRowIcon}
          icon={
            state === "close"
              ? isRTL
                ? "chevron_right"
                : "chevron_right"
              : "expand_more"
          }
        />
        {title} : {value} ({total} {t("items")})
      </div>
    </RowRenderer>
  );
});
