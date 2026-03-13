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
import "~/sass/elements/calendar.scss";
import calendarResourcesMock from "~/mock/calendar-resources.mock.json";
import { resources } from "~/locales/i18n";

/**
 * CalendarResource
 */
export interface CalendarResource {
  id: number;
  title: string;
  description: string;
}
/**
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
  activeResources?: number[];
  resources?: CalendarResource[];
}

type CalendarEventAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_EVENTS"; payload: CalendarEvent[] }
  | { type: "SET_RESOURCES"; payload: CalendarResource[] }
  | { type: "TOGGLE_RESOURCE_ACTIVE"; payload: CalendarResource[] }
  | { type: "UPSERT_EVENT"; payload: CalendarEvent }
  | { type: "REMOVE_EVENT"; payload: number }
  | { type: "CLEAR_EVENTS" }
  | { type: "SELECT_EVENT"; payload: number | null };

const initialState: CalendarEventState = {
  events: [],
  loading: false,
  error: null,
  selectedEventId: null,
  activeResources: [],
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
    case "TOGGLE_RESOURCE_ACTIVE": {
      const currentActiveIds = new Set(state.activeResources);
      const payloadIds = new Set(action.payload.map((r) => r.id));
      const newActiveIds = new Set(
        [...currentActiveIds]
          .filter((id) => !payloadIds.has(id))
          .concat([...payloadIds].filter((id) => !currentActiveIds.has(id)))
      );
      return {
        ...state,
        activeResources: Array.from(newActiveIds),
      };
    }
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
    case "CLEAR_EVENTS":
      return {
        ...state,
        events: [],
        selectedEventId: null,
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
  const calendarApi = React.useMemo(() => MApi.getCalendarApi(), []);
  const status = useSelector((state: StateType) => state.status);
  const [state, dispatch] = React.useReducer(
    calendarEventReducer,
    initialState
  );
  const userId = props.userId ?? status.userId ?? 0;
  const { resources } = calendarResourcesMock;
  const createEvent = React.useCallback(
    async (payload: CreateCalendarEventRequest) => {
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const newEvent = await calendarApi.createCalendarEvent({
          createCalendarEventRequest: payload,
        });

        dispatch({ type: "UPSERT_EVENT", payload: newEvent });
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

  const clearAllEvents = React.useCallback(async () => {
    if (state.events.length === 0) {
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      for (const event of state.events) {
        await calendarApi.deleteCalendarEvent({ eventId: event.id });
      }

      dispatch({ type: "CLEAR_EVENTS" });
    } catch (error) {
      if (isMApiError(error)) {
        dispatch({ type: "SET_ERROR", payload: error.message });
      } else {
        dispatch({ type: "SET_ERROR", payload: "Failed to clear events" });
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [calendarApi, state.events]);

  React.useEffect(() => {
    /**
     * Load calendar events for current query range
     * @param query query
     */
    const loadEvents = async (query: CalendarEventQuery) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const events = await calendarApi.getCalendarEvents(query);
        const resourcedIds = new Set(resources.map((r) => r.id));
        const eventsWithResources = events.map((event) => ({
          ...event,
          resourceId:
            Array.from(resourcedIds)[
              Math.floor(Math.random() * resourcedIds.size)
            ],
        }));

        dispatch({ type: "SET_EVENTS", payload: eventsWithResources });
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
      user: userId,
      start: new Date(),
      end: new Date(new Date().setMonth(new Date().getMonth() + 5)),
    });
  }, [calendarApi, userId, resources]);

  return (
    <>
      <div className="calendar__resources-container">
        {resources.map((resource) => (
          <div
            className={`calendar__resource ${state.activeResources?.includes(resource.id) ? "active" : ""}`}
            key={resource.id}
            onClick={() =>
              dispatch({ type: "TOGGLE_RESOURCE_ACTIVE", payload: [resource] })
            }
          >
            {resource.title}
          </div>
        ))}
      </div>
      <Calendar
        events={state.events}
        loading={state.loading}
        error={state.error}
        selectedEventId={state.selectedEventId}
        activeResources={
          resources.filter((r) => state.activeResources?.includes(r.id)) || []
        }
        onCreateEvent={createEvent}
        onUpdateEvent={updateEvent}
        onDeleteEvent={removeEvent}
        onClearEvents={clearAllEvents}
        onSelectEvent={(eventId) =>
          dispatch({ type: "SELECT_EVENT", payload: eventId })
        }
        onUpsertEvent={(event) =>
          dispatch({ type: "UPSERT_EVENT", payload: event })
        }
      />
    </>
  );
};

export default CalendarBody;
