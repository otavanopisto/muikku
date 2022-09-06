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

    default:
      return state;
  }
} */
