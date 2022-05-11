import { ActionType } from "~/actions";
import { Reducer } from "redux";

/**
 *  Participant
 */
export type Participant = {
  userEntityId: number;
  name: string;
  attendance: "UNCONFIRMED" | "YES" | "NO" | "MAYBE";
};

export type eventDisplay =
  | "auto"
  | "block"
  | "list-item"
  | "background"
  | "inverse-background"
  | "none";

/**
 *  CalendarEvent
 */
export interface CalendarEvent {
  id?: number;
  title?: string;
  start: string;
  end?: string;
  /** Can the event overlap with others */
  overlap?: boolean;
  /** Override for the event */
  editable?: boolean;
  classNames?: string[];
  description?: string;
  /** How the event is displayed in the calendar */
  display?: eventDisplay;
  backgroundColor?: string;
  /** Fullcalendar Resource */
  resourceId?: string;
  participants?: Participant[];
}

/**
 *  CalendarEventStatusUpdate
 */
export interface CalendarEventStatusUpdate {
  id: string;
  status: "YES" | "NO" | "MAYBE";
}

/**
 * EventState
 */
export type EventsState = "LOADING" | "ERROR" | "READY";

/**
 *  Calendar
 */
export interface Calendar {
  state: EventsState;
  guidanceEvents: CalendarEvent[];
}

/**
 * Evaluates an event against an array of events
 * @param event Event to be evaluated
 * @param events Events to evaluate against
 * @returns boolean
 */
export const evaluateEvents = (
  event: CalendarEvent,
  events: CalendarEvent[]
) => {
  let passed = true;
  for (let i = 0; i < events.length; i++) {
    if (events[i].id === event.id) {
      passed = false;
    }
  }
  return passed;
};

/**
 * initialCalendarState
 */
const initialCalendarState: Calendar = {
  state: "LOADING",
  guidanceEvents: [],
};

/**
 * Reducer function for calendar
 *
 * @param state state
 * @param action action
 * @returns State of calendar
 */
export const calendar: Reducer<Calendar> = (
  state = initialCalendarState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_CALENDAR_EVENTS_STATUS":
      return { ...state, state: action.payload };

    case "LOAD_CALENDAR_GUIDANCE_EVENTS": {
      const newEventsFiltered = action.payload.filter((event) =>
        evaluateEvents(event, state.guidanceEvents)
      );

      return {
        ...state,
        guidanceEvents: [...state.guidanceEvents, ...newEventsFiltered],
      };
    }

    case "ADD_CALENDAR_GUIDANCE_EVENT": {
      const updateGuidanceEvents = [...state.guidanceEvents];

      updateGuidanceEvents.push(action.payload);

      return {
        ...state,
        guidanceEvents: updateGuidanceEvents,
      };
    }

    case "UPDATE_CALENDAR_GUIDANCE_EVENT": {
      const filteredState = state.guidanceEvents.filter(
        (event) => event.id !== action.payload.id
      );

      const updatedGuidanceEvents = [...filteredState];

      updatedGuidanceEvents.push(action.payload);

      return { ...state, guidanceEvents: updatedGuidanceEvents };
    }

    case "DELETE_CALENDAR_GUIDANCE_EVENT": {
      if (typeof action.payload === "number") {
        return Object.assign({}, state, {
          guidanceEvents: state.guidanceEvents.filter(
            (event: CalendarEvent) => event.id !== (action.payload as number)
          ),
        });
      }

      const guidanceEvents = state.guidanceEvents;
      const currentEventObject = action.payload as CalendarEvent;
      const currentEventIndex = guidanceEvents.findIndex(
        (event) => event.id === currentEventObject.id
      );
      guidanceEvents[currentEventIndex] = currentEventObject;

      return { ...state, guidanceEvents: guidanceEvents };
    }

    default:
      return state;
  }
};

/**
 * Reducer function for calendar
 *
 * @param state
 * @param action
 * @returns returns state
 */
/* export default function calendar(
  state: Calendar = {
    state: "LOADING",
    guidanceEvents: [],
  },
  action: ActionType
): Calendar {
  switch (action.type) {
    case "UPDATE_CALENDAR_EVENTS_STATUS": {
      const newState: EventsState = action.payload;
      return Object.assign({}, state, { state: newState });
    }
    case "LOAD_CALENDAR_GUIDANCE_EVENTS": {
      const newEvents: CalendarEvent[] = action.payload;
      const newEventsFiltered = newEvents.filter((event) =>
        evaluateEvents(event, state.guidanceEvents)
      );

      return Object.assign({}, state, {
        guidanceEvents: [...state.guidanceEvents, ...newEventsFiltered],
      });
    }
    case "ADD_CALENDAR_GUIDANCE_EVENT": {
      const newEvent: CalendarEvent[] = [action.payload];
      return Object.assign({}, state, {
        guidanceEvents: [...state.guidanceEvents, ...newEvent],
      });
    }
    case "UPDATE_CALENDAR_GUIDANCE_EVENT": {
      const updateEvent: CalendarEvent[] = [action.payload];
      const filteredState = state.guidanceEvents.filter(
        (event) => event.id !== action.payload.id
      );

      return Object.assign({}, state, {
        guidanceEvents: [...filteredState, ...updateEvent],
      });
    }
    case "DELETE_CALENDAR_GUIDANCE_EVENT": {
      if (typeof action.payload === "number") {
        return Object.assign({}, state, {
          guidanceEvents: state.guidanceEvents.filter(
            (event: CalendarEvent) => event.id !== (action.payload as number)
          ),
        });
      }
      const guidanceEvents = state.guidanceEvents;
      const currentEventObject = action.payload as CalendarEvent;
      const currentEventIndex = guidanceEvents.findIndex(
        (event) => event.id === currentEventObject.id
      );
      guidanceEvents[currentEventIndex] = currentEventObject;

      return Object.assign({}, state, {
        guidanceEvents: guidanceEvents,
      });
    }
    default:
      return state;
  }
} */
