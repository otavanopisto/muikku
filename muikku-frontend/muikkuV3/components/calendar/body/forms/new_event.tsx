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

/**
 * CalendarApplicationProps
 */
export interface CalendarNewEventProps {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  selectedEventId: number | null;
  onCreateEvent: (payload: CreateCalendarEventRequest) => Promise<void>;
  onUpdateEvent: (payload: UpdateCalendarEventRequest) => Promise<void>;
}

/**
 * CalendarNewEvent
 * @param props props
 */
const CalendarNewEvent: React.FC<CalendarNewEventProps> = (props) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [start, setStart] = React.useState(new Date());
  const [end, setEnd] = React.useState(new Date());
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  /**
   * Handle create event form submit
   * @param event form event
   */
  const handleCreateEvent = async (event: React.FormEvent<HTMLFormElement>) => {
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
      await props.onCreateEvent({
        title: title.trim(),
        description: description.trim(),
        start: startDate,
        end: endDate,
        visibility: "PRIVATE",
      });

      setTitle("");
      setDescription("");
      setStart(new Date());
      setEnd(new Date());
    } catch (error) {
      setFormError("Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleCreateEvent}>
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
              onChange={(event) => setDescription(event.currentTarget.value)}
            />
          </div>

          <div>
            <label htmlFor="calendar-event-start">Start</label>
            <DatePicker
              id="eventStartDate"
              className="env-dialog__input env-dialog__input--date-picker"
              selected={start}
              onChange={(date: Date) => setStart(date)}
              locale={outputCorrectDatePickerLocale(localize.language)}
              dateFormat="P"
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
              dateFormat="P"
            />
          </div>

          {formError ? <div>{formError}</div> : null}

          <Button
            onClick={handleCreateEvent}
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create event"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CalendarNewEvent;
