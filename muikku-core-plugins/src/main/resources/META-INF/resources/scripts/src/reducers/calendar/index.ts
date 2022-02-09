import { ActionType } from "~/actions";

export type Participant = {
  userEntityId: number;
  name: string;
  attendance: "UNCONFIRMED" | "YES" | "NO" | "MAYBE";
};

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
  participants?: Participant[];
}

export type EventsState = "LOADING" | "ERROR" | "READY";

export interface Calendar {
  state: EventsState;
  guidanceEvents: Event[];
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
    guidanceEvents: [],
  },
  action: ActionType
): Calendar {
  switch (action.type) {
    case "UPDATE_CALENDAR_EVENTS_STATUS":
      const newState: EventsState = action.payload;
      return Object.assign({}, state, { state: newState });
    case "LOAD_CALENDAR_GUIDANCE_EVENTS":
      const newEvents: Event[] = action.payload;
      const newEventsFiltered = newEvents.filter((event) => {
        return evaluateEvents(event, state.guidanceEvents);
      });
      return Object.assign({}, state, {
        guidanceEvents: [...state.guidanceEvents, ...newEventsFiltered],
      });
    case "ADD_CALENDAR_GUIDANCE_EVENT":
      const newEvent: Event[] = [action.payload];
      return Object.assign({}, state, {
        guidanceEvents: [...state.guidanceEvents, ...newEvent],
      });
    case "UPDATE_CALENDAR_GUIDANCE_EVENT":
      const updateEvent: Event[] = [action.payload];
      const filteredState = state.guidanceEvents.filter(
        (event) => event.id !== action.payload.id
      );

      return Object.assign({}, state, {
        guidanceEvents: [...filteredState, ...updateEvent],
      });
    case "DELETE_CALENDAR_GUIDANCE_EVENT":
      return Object.assign({}, state, {
        guidanceEvents: state.guidanceEvents.filter(
          (event: Event) => event.id !== action.payload.id
        ),
      });
    default:
      return state;
  }
}
