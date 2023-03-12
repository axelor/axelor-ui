import moment from "moment";
import { useState } from "react";

import { SchedulerEvent } from "./types";
import { Scheduler, SchedulerProps } from "./scheduler";

const config = {
  component: Scheduler,
  title: "Advance/Scheduler",
};

let id = 0;

const now = moment().startOf("day").toDate();

const _events = [
  {
    id: 1,
    title: "Point in Time Event",
    start: now,
    end: now,
  },
  {
    id: 2,
    title: "Record dance",
    start: now,
    end: now,
  },
  {
    id: 3,
    title: "Edit Music",
    start: now,
    end: now,
  },
];

function SchedulerContainer(props: SchedulerProps) {
  const [events, setEvents] = useState<any[]>(_events);

  const handleEventCreate: SchedulerProps["onEventCreate"] = ({
    start,
    end,
  }) => {
    const title = window.prompt("New Event Name");

    if (title) {
      setEvents((events) => [
        ...events,
        { id: id++, start, end, title } as SchedulerEvent,
      ]);
    }
  };

  const handleEventDrop: SchedulerProps["onEventDrop"] = ({
    event,
    start,
    end,
    allDay: _allDay,
  }) => {
    let { allDay } = event;

    if (!event.allDay && _allDay) {
      allDay = true;
    } else if (event.allDay && !_allDay) {
      allDay = false;
    }

    setEvents((events) =>
      events.map((existingEvent) =>
        existingEvent.id === event.id
          ? ({ ...existingEvent, start, end, allDay } as SchedulerEvent)
          : existingEvent
      )
    );
  };

  const handleResizeEvent: SchedulerProps["onEventResize"] = ({
    event,
    start,
    end,
  }) => {
    setEvents((events) =>
      events.map((existingEvent) =>
        existingEvent.id === event.id
          ? ({ ...existingEvent, start, end } as SchedulerEvent)
          : existingEvent
      )
    );
  };

  return (
    <Scheduler
      events={events}
      style={{ height: 500 }}
      onEventCreate={handleEventCreate}
      onEventDrop={handleEventDrop}
      onEventResize={handleResizeEvent}
      {...props}
    />
  );
}

export const Basic = () => <SchedulerContainer />;

export const Readonly = () => (
  <SchedulerContainer onEventDrop={undefined} onEventResize={undefined} />
);

export const Component = () => (
  <SchedulerContainer
    components={{
      event: ({ event }: { event: SchedulerEvent }) => (
        <span style={{ fontStyle: "italic" }}>
          <strong>{event.title}</strong>
        </span>
      ),
    }}
  />
);

export const EventStyler = () => (
  <SchedulerContainer
    eventStyler={() => ({ style: { backgroundColor: "green" } })}
  />
);

export default config;
