import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { MuikkuEvent } from "~/mock/absence";
import { LoadingState } from "~/@types/shared";

interface MuikkuEvents {
  events: MuikkuEvent[];
  state: LoadingState;
}

/**
 * MuikkuEventsState
 */
export interface MuikkuEventsState {
  absenceEvents: MuikkuEvents;
}

const initialMuikkuEventsState: MuikkuEventsState = {
  absenceEvents: {
    events: [],
    state: "WAITING",
  },
};

/**
 * Reducer function for muikku events
 * @param state state
 * @param action action
 * @returns State of muikku events
 */
export const muikkuEvents: Reducer<MuikkuEventsState> = (
  state: MuikkuEventsState = initialMuikkuEventsState,
  action: ActionType
) => {
  switch (action.type) {
    case "EVENTS_SET_ABSENCE_EVENTS": {
      return {
        ...state,
        absenceEvents: { events: action.payload, state: "READY" },
      };
    }
    case "EVENTS_SET_ABSENCE_EVENTS_STATE": {
      return {
        ...state,
        absenceEvents: { ...state.absenceEvents, state: action.payload },
      };
    }
    case "EVENTS_UPDATE_ABSENCE_EVENT_PROPERTY": {
      const { eventId } = action.payload;
      return {
        ...state,
        absenceEvents: {
          ...state.absenceEvents,
          events: state.absenceEvents.events.map((event) => {
            if (event.id === eventId) {
              return {
                ...event,
                properties: [action.payload],
              };
            }
            return event;
          }),
        },
      };
    }
    default:
      return state;
  }
};
