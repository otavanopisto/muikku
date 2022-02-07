import { ActionType } from "~/actions";
import equals = require("deep-equal");
export interface Event {
  id?: string;
  title?: string;
  start: string;
  overlap?: boolean;
  end?: string;
  classNames?: string[];
  description?: string;
  display?: "auto" | "background";
  backgroundColor?: string;
  resourceId?: string;
}

export type EventsState = "LOADING" | "ERROR" | "READY";

export interface Calendar {
  state: EventsState;
  events: Event[];
}

/**
 * Evaluates an event against an array of events
 * @param event Event to be evaluated
 * @param events Events to evaluate against
 * @returns boolean
 */
export const evaluateEvents = (event: Event, events: Event[]) => {
  let passed = true;
  for (let i = 0; i < events.length; i++) {
    if (events[i].id === event.id) {
      passed = false;
    }
  }
  return passed;
};

export default function calendar(
  state: Calendar = {
    state: "LOADING",
    events: [],
  },
  action: ActionType
): Calendar {
  switch (action.type) {
    case "UPDATE_CALENDAR_EVENTS_STATUS":
      const newState: EventsState = action.payload;
      return Object.assign({}, state, { state: newState });
    case "LOAD_CALENDAR_EVENTS":
      const newEvents: Event[] = action.payload;
      const newEventsFiltered = newEvents.filter((event) => {
        return evaluateEvents(event, state.events);
      });
      return Object.assign({}, state, {
        events: [...state.events, ...newEventsFiltered],
      });
    case "UPDATE_CALENDAR_EVENTS":
      const newEvent: Event[] = [action.payload];
      return Object.assign({}, state, {
        events: [...state.events, ...newEvent],
      });
    case "DELETE_CALENDAR_EVENT":
      return Object.assign({}, state, {
        events: state.events.filter(
          (event: Event) => event.id !== action.payload.id
        ),
      });
    default:
      return state;
  }
}
