import * as React from "react";
import {
  CalendarEvent,
  CreateCalendarEventRequest,
  UpdateCalendarEventRequest,
} from "~/generated/client";

import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/react-select-override.scss";
import Button from "~/components/general/button";
import DatePicker from "react-datepicker";
import { outputCorrectDatePickerLocale } from "../../../../helper-functions/locale";
import { localize } from "~/locales/i18n";
import CalendarNewEventPortal from "../portals/calendar-event-portal";

/**
 * CalendarApplicationProps
 */
export interface CalendarNewEventProps {
  showPortal: boolean;
  event?: CalendarEvent;
  eventRequest?: CreateCalendarEventRequest;
  onClose: () => void;
  onCreateEvent: (payload: CreateCalendarEventRequest) => Promise<void>;
  onUpdateEvent: (payload: UpdateCalendarEventRequest) => Promise<void>;
}

/**
 * CalendarNewEvent
 * @param props props
 */
const CalendarNewEvent: React.FC<CalendarNewEventProps> = (props) => {
  const {
    showPortal,
    eventRequest,
    event,
    onClose,
    onCreateEvent,
    onUpdateEvent,
  } = props;

  const [title, setTitle] = React.useState(
    props.event ? props.event.title : ""
  );
  const [description, setDescription] = React.useState(
    props.event ? props.event.description : ""
  );
  const [start, setStart] = React.useState(
    props.event ? new Date(props.event.start) : new Date()
  );
  const [end, setEnd] = React.useState(
    props.event ? new Date(props.event.end) : new Date()
  );

  const [allDay, setAllDay] = React.useState(
    props.event ? props.event.allDay : false
  );
  const [type, setType] = React.useState(
    props.event ? props.event.type : undefined
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setStart(new Date(event.start));
      setEnd(new Date(event.end));
      setAllDay(event.allDay ? event.allDay : false);
      setType(event.type ? event.type : undefined);
    } else if (eventRequest) {
      setTitle(eventRequest.title);
      setDescription(eventRequest.description);
      setStart(new Date(eventRequest.start));
      setEnd(new Date(eventRequest.end));
      setAllDay(eventRequest.allDay ? eventRequest.allDay : false);
      setType(eventRequest.type ? eventRequest.type : undefined);
    } else {
      setTitle("");
      setDescription("");
      setStart(new Date());
      setEnd(new Date());
      setAllDay(false);
      setType(undefined);
    }
  }, [event, eventRequest]);

  /**
   * Handle create event form submit
   * @param event form event
   */
  const handleCreateEvent = async (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }

    if (!start || !end) {
      setFormError("Start and end are required");
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setFormError("Invalid start or end date");
      return;
    }

    if (endDate < startDate) {
      setFormError("End must be after start");
      return;
    }

    setFormError(null);
    setSubmitting(true);

    try {
      await onCreateEvent({
        title: title.trim(),
        description: description.trim(),
        start: startDate,
        end: endDate,
        allDay: allDay,
        visibility: "PRIVATE",
        type: type && type.trim(),
      });

      setTitle("");
      setDescription("");
      setStart(new Date());
      setEnd(new Date());
      setAllDay(false);
      setType(undefined);
      onClose();
    } catch (error) {
      setFormError("Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CalendarNewEventPortal isOpen={showPortal} onClose={props.onClose}>
      <form>
        {formError ? <div>{formError}</div> : null}
        <div>
          <label htmlFor="calendar-event-title">Title</label>
          <div>
            <input
              id="calendar-event-title"
              type="text"
              className="form-element__input"
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="calendar-event-description">Description</label>
          <textarea
            id="calendar-event-description"
            className="form-element__textarea"
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor="calendar-event-type">Type</label>
          <div>
            <input
              id="calendar-event-type"
              type="text"
              className="form-element__input"
              value={type}
              onChange={(event) => setType(event.currentTarget.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="calendar-event-start">Start</label>
          <DatePicker
            id="eventStartDate"
            className="env-dialog__input env-dialog__input--date-picker"
            selected={start}
            onChange={(date: Date) => setStart(date)}
            locale={outputCorrectDatePickerLocale(localize.language)}
            dateFormat="P HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={5}
          />
        </div>
        <div>
          <label htmlFor="calendar-event-end">End</label>
          <DatePicker
            id="eventStartDate"
            className="env-dialog__input env-dialog__input--date-picker"
            selected={end}
            onChange={(date: Date) => setEnd(date)}
            locale={outputCorrectDatePickerLocale(localize.language)}
            dateFormat="P HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={5}
          />
        </div>
        <div>
          <label htmlFor="calendar-event-all-day">All day</label>
          <input
            id="calendar-event-all-day"
            type="checkbox"
            checked={allDay}
            onChange={(event) => setAllDay(event.currentTarget.checked)}
          />
        </div>
        <Button onClick={handleCreateEvent} type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create event"}
        </Button>
        <Button onClick={props.onClose} type="button" disabled={submitting}>
          Cancel
        </Button>
      </form>
    </CalendarNewEventPortal>
  );
};

export default CalendarNewEvent;
