import * as React from "react";
import Calendar from "./body/application";
import MApi, { isMApiError } from "~/api/api";
import { useSelector } from "react-redux";
import {
  CalendarEvent,
  CreateCalendarEventRequest,
  UpdateCalendarEventRequest,
} from "~/generated/client";
import { StateType } from "~/reducers";
/**
 * CalendarBodyProps
 */
interface CalendarBodyProps {
  userId?: number;
}

/**
 * Calendar event query for API requests
 */
interface CalendarEventQuery {
  user: number;
  start: Date;
  end: Date;
  adjustTimes?: boolean;
  type?: string;
}

/**
 * Calendar event state
 */
interface CalendarEventState {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  selectedEventId: number | null;
}

type CalendarEventAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_EVENTS"; payload: CalendarEvent[] }
  | { type: "UPSERT_EVENT"; payload: CalendarEvent }
  | { type: "REMOVE_EVENT"; payload: number }
  | { type: "SELECT_EVENT"; payload: number | null };

const initialState: CalendarEventState = {
  events: [],
  loading: false,
  error: null,
  selectedEventId: null,
};

/**
 * Calendar event reducer
 * @param state state
 * @param action action
 * @returns new state
 */
const calendarEventReducer = (
  state: CalendarEventState,
  action: CalendarEventAction
): CalendarEventState => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_EVENTS":
      return {
        ...state,
        events: action.payload,
      };
    case "UPSERT_EVENT": {
      const eventExists = state.events.some(
        (event) => event.id === action.payload.id
      );

      return {
        ...state,
        events: eventExists
          ? state.events.map((event) =>
              event.id === action.payload.id ? action.payload : event
            )
          : [...state.events, action.payload],
      };
    }
    case "REMOVE_EVENT":
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
        selectedEventId:
          state.selectedEventId === action.payload
            ? null
            : state.selectedEventId,
      };
    case "SELECT_EVENT":
      return {
        ...state,
        selectedEventId: action.payload,
      };
    default:
      return state;
  }
};

/**
 * CalendarBody
 * @param props props
 */
const CalendarBody = (props: CalendarBodyProps) => {
  const calendarApi = MApi.getCalendarApi();
  const status = useSelector((state: StateType) => state.status);
  const [state, dispatch] = React.useReducer(
    calendarEventReducer,
    initialState
  );

  const createEvent = React.useCallback(
    async (payload: CreateCalendarEventRequest) => {
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        await calendarApi.createCalendarEvent({
          createCalendarEventRequest: payload,
        });
      } catch (error) {
        if (isMApiError(error)) {
          dispatch({ type: "SET_ERROR", payload: error.message });
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to create event" });
        }
      }
    },
    [calendarApi]
  );

  const updateEvent = React.useCallback(
    async (payload: UpdateCalendarEventRequest) => {
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        await calendarApi.updateCalendarEvent({
          updateCalendarEventRequest: payload,
        });
      } catch (error) {
        if (isMApiError(error)) {
          dispatch({ type: "SET_ERROR", payload: error.message });
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to update event" });
        }
      }
    },
    [calendarApi]
  );

  const removeEvent = React.useCallback(
    async (eventId: number) => {
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        await calendarApi.deleteCalendarEvent({ eventId });
        dispatch({ type: "REMOVE_EVENT", payload: eventId });
      } catch (error) {
        if (isMApiError(error)) {
          dispatch({ type: "SET_ERROR", payload: error.message });
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to delete event" });
        }
      }
    },
    [calendarApi]
  );

  React.useEffect(() => {
    const loadEvents = async (query: CalendarEventQuery) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const events = await calendarApi.getCalendarEvents(query);

        dispatch({ type: "SET_EVENTS", payload: events });
      } catch (error) {
        if (isMApiError(error)) {
          dispatch({ type: "SET_ERROR", payload: error.message });
        } else {
          dispatch({ type: "SET_ERROR", payload: "Failed to load events" });
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadEvents({
      user: props.userId || status.userId || 0,
      start: new Date(),
      end: new Date(new Date().setMonth(new Date().getMonth() + 5)),
    });
  }, [status, props.userId, calendarApi]);

  return (
    <div>
      <Calendar
        events={state.events}
        loading={state.loading}
        error={state.error}
        selectedEventId={state.selectedEventId}
        onCreateEvent={createEvent}
        onUpdateEvent={updateEvent}
        onDeleteEvent={removeEvent}
        onSelectEvent={(eventId) =>
          dispatch({ type: "SELECT_EVENT", payload: eventId })
        }
        onUpsertEvent={(event) =>
          dispatch({ type: "UPSERT_EVENT", payload: event })
        }
      />
    </div>
  );
};

export default CalendarBody;
