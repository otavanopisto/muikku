import actions from "../../base/notifications";
import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi, { MApiError } from "~/lib/mApi";
import { StateType } from "~/reducers";
import { EventsState, Event } from "~/reducers/calendar";

export type Participants = {
  userEntityId: number;
};
export interface LoadCalendarEventParams {
  userEntityId: number;
  begins: string;
  ends: string;
}

export type EventVisibility = "PRIVATE" | "PUBLIC";
export interface LoadCalendarEventsTriggerType {
  (
    userEntityId: number,
    start: string,
    end: string,
    type?: string
  ): AnyActionType;
}

export interface createCalendarEventTriggerType {
  (event: {
    start: string;
    end?: string;
    allDay?: boolean;
    title: string;
    description: string;
    visibility: EventVisibility;
    type?: string;
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
  function loadCalendarEvents(
    userEntityId: number,
    start: string,
    end: string,
    type: string
  ) {
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
            await promisify(
              mApi().calendar.events.read({ userEntityId, start, end, type }),
              "callback"
            )()
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

const createCalendarEvent: createCalendarEventTriggerType =
  function createCalendarEvent(event) {
    const {
      start,
      end,
      allDay = false,
      title,
      description,
      visibility,
      type,
      participants,
    } = event;

    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      dispatch({
        type: "UPDATE_CALENDAR_EVENTS",
        payload: <Event>await promisify(
          mApi().calendar.event.create({
            start,
            end,
            allDay,
            title,
            description,
            visibility,
            type,
            participants,
          }),
          "callback"
        )(),
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

export default { loadCalendarEvents };
export { createCalendarEvent, loadCalendarEvents };
