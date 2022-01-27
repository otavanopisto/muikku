import actions from "../../base/notifications";
import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi, { MApiError } from "~/lib/mApi";
import { StateType } from "~/reducers";
import { EventsState, Event } from "~/reducers/calendar";

export type Participants = {
  userEntityId: number;
};

export interface LoadCalendarEventsTriggerType {
  (): AnyActionType;
}

export interface createCalendarEventTriggerType {
  (event: {
    begins: string;
    ends?: string;
    allDay?: boolean;
    title: string;
    description: string;
    visibility: "PRIVATE" | "PUBLIC";
    participants: Participants[];
  }): AnyActionType;
}

export interface LOAD_CALENDAR_EVENTS
  extends SpecificActionType<"LOAD_CALENDAR_EVENTS", Event[]> {}
export interface UPDATE_CALENDAR_EVENTS
  extends SpecificActionType<"UPDATE_CALENDAR_EVENTS", Event> {}
export interface DELETE_CALENDAR_EVENT
  extends SpecificActionType<"DELETE_CALENDAR_EVENT", Event> {}
export interface UPDATE_CALENDAR_EVENTS_STATUS
  extends SpecificActionType<"UPDATE_CALENDAR_EVENTS_STATUS", EventsState> {}

const loadCalendarEvents: LoadCalendarEventsTriggerType =
  function loadCalendarEvents() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_CALENDAR_EVENTS_STATUS",
          payload: <EventsState>"LOADING",
        });
        dispatch({
          type: "LOAD_CALENDAR_EVENTS",
          payload: <Event[]>(
            await promisify(mApi().calendar.events.read(), "callback")()
          ),
        });
        dispatch({
          type: "UPDATE_CALENDAR_EVENTS_STATUS",
          payload: <EventsState>"READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(getState().i18n.text.get("todo"), "error")
        );
        dispatch({
          type: "UPDATE_CALENDAR_EVENTS_STATUS",
          payload: <EventsState>"ERROR",
        });
      }
    };
  };

export const createCalendarEvent: createCalendarEventTriggerType =
  function createCalendarEvent(event) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      dispatch({
        type: "UPDATE_CALENDAR_EVENTS",
        payload: <Event>(
          await promisify(mApi().calendar.events.create(event), "callback")()
        ),
      });
      try {
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(getState().i18n.text.get("todo"), "error")
        );
      }
    };
  };
export default loadCalendarEvents;
