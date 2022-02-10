import { ActionType } from "~/actions";

/**
 *  Participant
 */
export type Participant = {
  userEntityId: number;
  name: string;
  attendance: "UNCONFIRMED" | "YES" | "NO" | "MAYBE";
};

export type eventDisplay = "auto" | "block" | "list-item" | "background" | "inverse-background" | "none";
/**
 *  CalendarEvent
 */
export interface CalendarEvent {
  id?: string;
  title?: string;
  start: string;
  end?: string;
  overlap?: boolean; // Can the event overlap with others
  editable: boolean; // Override for the event
  classNames?: string[];
  description?: string;
  display?: eventDisplay; // how the event is displayed in the calendar
  backgroundColor?: string;
  resourceId?: string; // Resource
  participants?: Participant[];
}

/**
 *  CalendarEventStatusUpdate
 */
export interface CalendarEventStatusUpdate {
  id: string;
  status: "YES" | "NO" | "MAYBE"
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
 * Reducer function for calendar
 *
 * @param state
 * @param action
 * @returns returns state
 */
export default function calendar(
  state: Calendar = {
    state: "LOADING",
    guidanceEvents: [],
  },
  action: ActionType
): Calendar {
  switch (action.type) {
    case "UPDATE_CALENDAR_EVENTS_STATUS":
      const newState: EventsState = action.payload;
      return Object.assign({}, state, { state: newState });
    case "LOAD_CALENDAR_GUIDANCE_EVENTS":
      const newEvents: CalendarEvent[] = action.payload;
      const newEventsFiltered = newEvents.filter((event) => {
        return evaluateEvents(event, state.guidanceEvents);
      });
      return Object.assign({}, state, {
        guidanceEvents: [...state.guidanceEvents, ...newEventsFiltered],
      });
    case "ADD_CALENDAR_GUIDANCE_EVENT":
      const newEvent: CalendarEvent[] = [action.payload];
      return Object.assign({}, state, {
        guidanceEvents: [...state.guidanceEvents, ...newEvent],
      });
    case "UPDATE_CALENDAR_GUIDANCE_EVENT":
      const updateEvent: CalendarEvent[] = [action.payload];
      const filteredState = state.guidanceEvents.filter(
        (event) => event.id !== action.payload.id
      );

      return Object.assign({}, state, {
        guidanceEvents: [...filteredState, ...updateEvent],
      });
    case "DELETE_CALENDAR_GUIDANCE_EVENT":
      return Object.assign({}, state, {
        guidanceEvents: state.guidanceEvents.filter(
          (event: CalendarEvent) => event.id !== action.payload.id
        ),
      });
    default:
      return state;
  }
}
