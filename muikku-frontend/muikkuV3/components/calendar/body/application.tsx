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
import {
  Calendar as BigCalendar,
  EventProps,
  momentLocalizer,
  SlotInfo,
} from "react-big-calendar";
import FullCalendar from "@fullcalendar/react";
import { EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import moment from "moment";
import Button from "~/components/general/button";
import CalendarNewEventPortal from "./portals/calendar-event-portal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarResource } from "../body";

/**
 * CalendarApplicationProps
 */
export interface CalendarApplicationProps {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  selectedEventId: number | null;
  activeResources?: CalendarResource[];
  onSelectEvent: (eventId: number | null) => void;
  onCreateEvent: (payload: CreateCalendarEventRequest) => Promise<void>;
  onUpdateEvent: (payload: UpdateCalendarEventRequest) => Promise<void>;
  onDeleteEvent: (eventId: number) => Promise<void>;
  onClearEvents: () => Promise<void>;
  onUpsertEvent: (event: CalendarEvent) => void;
}

/**
 * CalendarApplication
 * @param props props
 */
const CalendarApplication: React.FC<CalendarApplicationProps> = (props) => {
  const [showPortal, setShowPortal] = React.useState(false);
  const [showEventInfoPortal, setShowEventInfoPortal] = React.useState(false);
  const [eventInfoEvent, setEventInfoEvent] =
    React.useState<CalendarEvent | null>(null);
  const [eventInfoPosition, setEventInfoPosition] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const localizer = momentLocalizer(moment);
  const [eventRequest, setEventRequest] =
    React.useState<CreateCalendarEventRequest | null>(null);

  /**
   * Custom big calendar event renderer
   * @param props event props
   */
  const CustomEvent: React.FC<EventProps<CalendarEvent>> = ({ event }) => (
    <div className={`event event--${event.type}`}>{event.title}</div>
  );

  const components = {
    event: CustomEvent,
  };

  const headerToolbar = {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  };
  const fullCalendarEvents = React.useMemo(
    () =>
      props.events.map((event) => ({
        id: String(event.id),
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
      })),
    [props.events]
  );

  /**
   * Handle big calendar time slot click
   * @param timeSlot time slot
   */
  const handleBigCalendarTimeSlotClick = (timeSlot: SlotInfo) => {
    setShowPortal(true);

    const newEvent: CreateCalendarEventRequest = {
      title: "",
      description: "",
      start: timeSlot.start,
      end: timeSlot.end,
      allDay: timeSlot.action === "select" && timeSlot.slots.length === 1,
    };
    setEventRequest(newEvent);
  };

  /**
   * Handle big calendar event click
   * @param event selected event
   * @param e synthetic event
   */
  const handleBigCalendarEventClick = (
    event: CalendarEvent,
    e: React.SyntheticEvent<HTMLElement>
  ) => {
    const eventId = Number(event.id);
    const clickedEvent =
      props.events.find((event) => event.id === eventId) || null;
    const eventRect = (e.target as HTMLElement).getBoundingClientRect();

    setEventInfoEvent(clickedEvent);
    setEventInfoPosition({
      top: eventRect.bottom + 8,
      left: eventRect.left,
    });
    setShowEventInfoPortal(true);
    props.onSelectEvent(eventId);
  };

  /**
   * Handle full calendar date click
   * @param dateClickInfo time slot
   */
  const handleFullcalendarDateClick = (dateClickInfo: DateClickArg) => {
    setShowPortal(true);

    const newEvent: CreateCalendarEventRequest = {
      title: "",
      description: "",
      start: dateClickInfo.date,
      end: dateClickInfo.date,
      allDay: dateClickInfo.allDay,
    };
    setEventRequest(newEvent);
  };

  /**
   * Handle full calendar event click
   * @param clickInfo click info
   */
  const handleFullCalendarEventClick = (clickInfo: EventClickArg) => {
    const eventId = Number(clickInfo.event.id);
    const clickedEvent =
      props.events.find((event) => event.id === eventId) || null;
    const eventRect = clickInfo.el.getBoundingClientRect();

    setEventInfoEvent(clickedEvent);
    setEventInfoPosition({
      top: eventRect.bottom + 8,
      left: eventRect.left,
    });
    setShowEventInfoPortal(true);
    props.onSelectEvent(eventId);
  };

  return (
    <div className="calendar">
      {props.error ? <div>{props.error}</div> : null}
      <Button onClick={() => setShowPortal((visible) => !visible)}>
        {showPortal ? "Close form" : "New event"}
      </Button>
      <Button
        onClick={props.onClearEvents}
        disabled={props.loading || props.events.length === 0}
      >
        Clear all events
      </Button>
      <CalendarNewEvent
        showPortal={showPortal}
        eventRequest={eventRequest ?? undefined}
        onClose={() => setShowPortal(false)}
        onCreateEvent={props.onCreateEvent}
        onUpdateEvent={props.onUpdateEvent}
      />
      <CalendarNewEventPortal
        isOpen={showEventInfoPortal && !!eventInfoEvent}
        onClose={() => {
          setShowEventInfoPortal(false);
          setEventInfoPosition(null);
        }}
        anchorPosition={eventInfoPosition || undefined}
      >
        <div>
          <h3>{eventInfoEvent?.title}</h3>
          <p>{eventInfoEvent?.description}</p>
          <p>
            <strong>Type:</strong> {eventInfoEvent?.type || "-"}
          </p>
          <p>
            <strong>Start:</strong>{" "}
            {eventInfoEvent
              ? new Date(eventInfoEvent.start).toLocaleString()
              : "-"}
          </p>
          <p>
            <strong>End:</strong>{" "}
            {eventInfoEvent
              ? new Date(eventInfoEvent.end).toLocaleString()
              : "-"}
          </p>
          <Button onClick={() => setShowEventInfoPortal(false)}>Close</Button>
        </div>
      </CalendarNewEventPortal>

      <div className="calendar__calendar-component">
        <h1>Big calendar</h1>
        <BigCalendar
          localizer={localizer}
          onSelectSlot={handleBigCalendarTimeSlotClick}
          onSelectEvent={handleBigCalendarEventClick}
          events={props.events}
          components={components}
          resources={
            props.activeResources.length > 0 ? props.activeResources : undefined
          }
          tooltipAccessor={"description"}
          style={{ height: 500, margin: "50px" }}
          selectable
        />
      </div>
      <div className="calendar__calendar-component">
        <h1>Full calendar</h1>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridDay"
          headerToolbar={headerToolbar}
          eventClick={handleFullCalendarEventClick}
          locale={"fi"}
          events={fullCalendarEvents}
          dateClick={handleFullcalendarDateClick}
          selectable
        />
      </div>
    </div>
  );
};

export default CalendarApplication;
