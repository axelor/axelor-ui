import moment, { Dayjs, OpUnitType } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import duration from "dayjs/plugin/duration";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isoWeek from "dayjs/plugin/isoWeek";
import minMax from "dayjs/plugin/minMax";
import utc from "dayjs/plugin/utc";
import * as TYPES from "./types";

moment.extend(advancedFormat);
moment.extend(isSameOrAfter);
moment.extend(duration);
moment.extend(minMax);
moment.extend(utc);
moment.extend(isoWeek);

const CONNECT_FINISH = "finish";
const CONNECT_START = "start";

export const CONFIG = {
  LINE_HEIGHT: 30,
  CELL_HEIGHT: 36,
  DND_TYPES: {
    LINE: "LINE",
    PROGRESS: "PROGRESS",
    RESIZE_LEFT: "RESIZE_LEFT",
    RESIZE_RIGHT: "RESIZE_RIGHT",
    CONNECT_START: "CONNECT_START",
    CONNECT_END: "CONNECT_END",
  },
};

export const GANTT_TYPES: Record<string, TYPES.GanttType> = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
};

const viewConfig: Record<TYPES.GanttType, any> = {
  month: { width: 50, value: 7 * 24, type: "weeks" },
  day: { width: 50, value: 1, type: "hours" },
  week: { width: 70, value: 24, type: "days" },
  year: { width: 100, value: 31 * 24, type: "months" },
};

function getMomentList(
  type: "hour" | "month" | "day" | "week" | "year",
  format: string | ((current: Dayjs, start: Dayjs, end: Dayjs) => string),
  startDate: Dayjs,
  endDate: Dayjs,
  hourSize: number,
  compareType?: "hour" | "month" | "day" | "week" | "year",
  startOfType?: "isoWeek"
): TYPES.GanttHeaderItem[] {
  compareType = compareType || type;
  const list: TYPES.GanttHeaderItem[] = [];

  let current = startDate.clone();

  while (endDate.isSameOrAfter(current)) {
    let start = current.startOf((startOfType || type) as OpUnitType);
    let end = current.endOf((startOfType || type) as OpUnitType);

    start = start.isBefore(startDate) ? startDate : start;
    end = end.isAfter(endDate) ? endDate : end;

    const hours = moment.duration(end.diff(start)).asHours();
    const title =
      typeof format === "function"
        ? format(current, start, end)
        : `${current.format(format)}`;

    let next = start.add(1, type);
    while (current.isSame(next)) {
      next = next.add(1, type);
    }
    current = next;

    list.push({
      title,
      hours,
      width: Math.round(hours * hourSize),
    });
  }

  return list;
}

export function getGraphConfig(
  data: TYPES.GanttRecord[],
  view: TYPES.GanttType,
  containerWidth: number
) {
  const config = viewConfig[view];
  const dateData = data.filter((x) => x.startDate);

  const startDates = dateData.map((item) => moment(item.startDate));
  const endDates = dateData.map((item) =>
    item.endDate
      ? moment(item.endDate)
      : moment(item.startDate).add(Number(item.duration || 0), "h")
  );

  const minDate = moment.min(startDates) ?? moment();
  const maxDate = moment.max(endDates) ?? moment();

  const startDate = minDate.startOf(config.type).subtract(2, config.type);
  const endDate = maxDate.endOf(config.type).add(2, config.type);
  const hourDiff = moment.duration(endDate.diff(startDate)).asHours();

  let { width: cellWidth, value: cellHours } = config;
  let hourSize = Number(cellWidth / cellHours);
  let totalWidth = Number((hourDiff * hourSize).toFixed(0));

  if (totalWidth > 0 && totalWidth < containerWidth) {
    hourSize = containerWidth / hourDiff;
    cellWidth = Math.round(hourSize * cellHours);
    totalWidth = containerWidth;
  }

  return {
    startDate,
    endDate,
    totalWidth,
    hourSize,
    cellWidth,
  };
}

function getBendingPoints(coordinates: any) {
  const { sx, sy, ex, ey, sheight, sourceStart, targetEnd } = coordinates;
  const points = [];
  const offset = 20;

  if (sourceStart === CONNECT_START && targetEnd === CONNECT_START) {
    if (ex < sx) {
      points.push({ x: ex - offset, y: sy });
      points.push({ x: ex - offset, y: ey });
    } else {
      points.push({ x: sx - offset, y: sy });
      points.push({ x: sx - offset, y: ey });
    }
  } else if (sourceStart === CONNECT_START && targetEnd === CONNECT_FINISH) {
    if (ex < sx - 20) {
      points.push({ x: sx - offset, y: sy });
      points.push({ x: sx - offset, y: ey < sy ? ey : ey + 2 });
    } else {
      let midHeightConstant =
        ey < sy ? sy - sheight / 2 - 5 : sy + sheight / 2 + 5;
      points.push({ x: sx - offset, y: sy });
      points.push({ x: sx - offset, y: midHeightConstant });
      points.push({
        x: ex + offset,
        y: ey < sy ? midHeightConstant + 2 : midHeightConstant,
      });
      points.push({ x: ex + offset, y: ey < sy ? ey : ey + 2 });
    }
  } else if (sourceStart === CONNECT_FINISH && targetEnd === CONNECT_FINISH) {
    if (sx + 20 < ex) {
      points.push({ x: ex + offset, y: ey < sy ? sy + 2 : sy });
      points.push({ x: ex + offset, y: ey < sy ? ey : ey + 2 });
    } else {
      points.push({ x: sx + offset, y: ey < sy ? sy + 2 : sy });
      points.push({ x: sx + offset, y: ey < sy ? ey : ey + 2 });
    }
  } else {
    if (sx + 20 < ex) {
      if (sy > ey) {
        points.push({ x: sx + offset, y: sy + 2 });
      } else {
        points.push({ x: sx + offset, y: sy });
      }
      points.push({ x: sx + offset, y: ey });
    } else {
      if (sy > ey) {
        points.push({ x: sx + offset, y: sy + 2 });
        points.push({ x: sx + offset, y: sy - sheight + 5 / 2 });
        points.push({ x: ex - offset, y: sy - sheight + 5 / 2 });
      } else {
        points.push({ x: sx + offset, y: sy });
        points.push({ x: sx + offset, y: sy + sheight / 2 + 5 });
        points.push({ x: ex - offset, y: sy + sheight / 2 + 3 });
      }
      points.push({ x: ex - offset, y: ey });
    }
  }
  return points;
}

export function getGraphEdges(
  data: TYPES.GanttRecord[],
  startDate: Dayjs,
  endDate: Dayjs,
  hourSize: number
): TYPES.GanttEdge[] {
  const computedData = data.map((record, i) => {
    const plannedDate = moment(record.startDate);
    const width = Number((Number(record.duration) * hourSize).toFixed(0));
    const diffHours = moment.duration(plannedDate.diff(startDate)).asHours();
    const x = Number((diffHours * hourSize).toFixed(0));
    const y = CONFIG.CELL_HEIGHT * i;

    return {
      record,
      height: CONFIG.LINE_HEIGHT,
      width,
      x,
      y,
    };
  }, []);

  const edges = computedData.reduce(
    (edges: TYPES.GanttEdge[], { record, x, y, height, width }, i) => {
      const { finishToStart, finishToFinish, startToStart, startToFinish } =
        record;

      function checkEdges(
        list: TYPES.Record[] | undefined,
        start: TYPES.GanttEdgeType,
        end: TYPES.GanttEdgeType
      ) {
        function prepareEdge(item: TYPES.Record): TYPES.GanttEdge {
          const targetItem = { x, y, height, width };
          const sourceItem =
            computedData.find((e) => e.record.id === item.id) || targetItem;

          const sx =
            sourceItem.x + (start === CONNECT_START ? 0 : sourceItem.width);
          const sy = sourceItem.y + (sourceItem.height + 6) / 2;
          const ex =
            targetItem.x + (end === CONNECT_FINISH ? targetItem.width : 0);
          const ey = targetItem.y + (targetItem.height + 6) / 2;

          return {
            source: item.id,
            target: record.id,
            startPoint: { x: sx, y: sy },
            endPoint: { x: ex, y: ey },
            bendPoints: getBendingPoints({
              sx,
              sy,
              ex,
              ey,
              sheight: sourceItem.height,
              sourceStart: start,
              targetEnd: end,
            }),
            start,
            end,
          };
        }
        edges.push(
          ...(list || []).map(prepareEdge).filter((item) => Boolean(item))
        );
      }

      checkEdges(finishToStart, CONNECT_FINISH, CONNECT_START);
      checkEdges(startToFinish, CONNECT_START, CONNECT_FINISH);
      checkEdges(startToStart, CONNECT_START, CONNECT_START);
      checkEdges(finishToFinish, CONNECT_FINISH, CONNECT_FINISH);

      return edges;
    },
    []
  );

  return edges;
}

export function getHeader(
  type: TYPES.GanttType,
  startDate: Dayjs,
  endDate: Dayjs,
  hourSize: number
) {
  switch (type) {
    case GANTT_TYPES.WEEK: {
      const dayList = getMomentList(
        "day",
        "ddd DD",
        startDate,
        endDate,
        hourSize
      );
      const weekList = getMomentList(
        "week",
        (current, start, end) =>
          `${current.format("W")}(${start.format("DD/MM/YYYY")} - ${end.format(
            "DD/MM/YYYY"
          )})`,
        startDate,
        endDate,
        hourSize,
        "day",
        "isoWeek"
      );
      return [weekList, dayList];
    }
    case GANTT_TYPES.DAY: {
      const hoursList = getMomentList(
        "hour",
        "HH:00",
        startDate,
        endDate,
        hourSize
      );
      const dayList = getMomentList(
        "day",
        "DD/MM/YYYY",
        startDate,
        endDate,
        hourSize,
        "hour"
      );
      return [dayList, hoursList];
    }
    case GANTT_TYPES.MONTH: {
      const weekList = getMomentList("week", "W", startDate, endDate, hourSize);
      const monthList = getMomentList(
        "month",
        "MMMM, YYYY",
        startDate,
        endDate,
        hourSize,
        "day"
      );
      return [monthList, weekList];
    }
    case GANTT_TYPES.YEAR: {
      const monthList = getMomentList(
        "month",
        "MMM",
        startDate,
        endDate,
        hourSize
      );
      const yearList = getMomentList(
        "year",
        "YYYY",
        startDate,
        endDate,
        hourSize,
        "day"
      );
      return [yearList, monthList];
    }
    default:
      return [];
  }
}

export function getDateFromOffset(
  offsetX: number,
  startDate: Dayjs,
  view: TYPES.GanttType,
  cellSize: number
) {
  const { type } = viewConfig[view];
  const total = Number((offsetX / cellSize).toFixed(0));
  let date = startDate.clone();
  date = date.add(total, type);
  return date.utc().format();
}
