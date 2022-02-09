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

export interface deleteCalendarEventTriggerType {
  (id: number): AnyActionType;
}

export interface LOAD_CALENDAR_GUIDANCE_EVENTS
  extends SpecificActionType<"LOAD_CALENDAR_GUIDANCE_EVENTS", Event[]> {}
export interface UPDATE_CALENDAR_GUIDANCE_EVENT
  extends SpecificActionType<"UPDATE_CALENDAR_GUIDANCE_EVENT", Event> {}
export interface ADD_CALENDAR_GUIDANCE_EVENT
  extends SpecificActionType<"ADD_CALENDAR_GUIDANCE_EVENT", Event> {}
export interface DELETE_CALENDAR_GUIDANCE_EVENT
  extends SpecificActionType<"DELETE_CALENDAR_GUIDANCE_EVENT", Event> {}
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
          type: "LOAD_CALENDAR_GUIDANCE_EVENTS",
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
        type: "ADD_CALENDAR_GUIDANCE_EVENT",
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

const updateCalendarEvent: createCalendarEventTriggerType =
  function updateCalendarEvent(event) {
    const {
      start,
      end,
      allDay,
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
        type: "UPDATE_CALENDAR_GUIDANCE_EVENT",
        payload: <Event>await promisify(
          mApi().calendar.event.update({
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

const deleteCalendarEvent: deleteCalendarEventTriggerType =
  function deleteCalendarEvent(id) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      dispatch({
        type: "DELETE_CALENDAR_GUIDANCE_EVENT",
        payload: <Event>(
          await promisify(mApi().calendar.event.del(id), "callback")()
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

export default { loadCalendarEvents };
export {
  createCalendarEvent,
  loadCalendarEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
};
