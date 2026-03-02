import * as React from "react";
import {
  CalendarEvent,
  CreateCalendarEventRequest,
  UpdateCalendarEventRequest,
} from "~/generated/client";

import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/react-select-override.scss";
import CalendarNewEvent from "./forms/new_event";

/**
 * CalendarApplicationProps
 */
export interface CalendarApplicationProps {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  selectedEventId: number | null;
  onSelectEvent: (eventId: number | null) => void;
  onCreateEvent: (payload: CreateCalendarEventRequest) => Promise<void>;
  onUpdateEvent: (payload: UpdateCalendarEventRequest) => Promise<void>;
  onDeleteEvent: (eventId: number) => Promise<void>;
  onUpsertEvent: (event: CalendarEvent) => void;
}

/**
 * CalendarApplication
 * @param props props
 */
const CalendarApplication: React.FC<CalendarApplicationProps> = (props) => {
  const selectedEvent = props.events.find(
    (event) => event.id === props.selectedEventId
  );

  return (
    <div>
      {props.error ? <div>{props.error}</div> : null}
      <CalendarNewEvent
        events={props.events}
        loading={props.loading}
        error={props.error}
        selectedEventId={props.selectedEventId}
        onCreateEvent={props.onCreateEvent}
        onUpdateEvent={props.onUpdateEvent}
      />
      <div>Calendar events: {props.events.length}</div>

      {props.events.map((event) => (
        <div key={event.id}>
          <button type="button" onClick={() => props.onSelectEvent(event.id)}>
            {event.title}
          </button>
          {event.removable ? (
            <button type="button" onClick={() => props.onDeleteEvent(event.id)}>
              Delete
            </button>
          ) : null}
        </div>
      ))}

      {selectedEvent ? <div>Selected event: {selectedEvent.title}</div> : null}
    </div>
  );
};

export default CalendarApplication;
