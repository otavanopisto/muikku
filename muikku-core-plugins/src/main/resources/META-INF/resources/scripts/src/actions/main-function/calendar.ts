import actions from "../base/notifications";
import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi, { MApiError } from "~/lib/mApi";
import { StateType } from "~/reducers";
import { EventsState, CalendarEvent } from "~/reducers/calendar";

/**
 * Participant
 */
export type Participants = {
  userEntityId: number;
};
/**
 * LoadCalendarEventParams
 */
export interface LoadCalendarEventParams {
  userEntityId: number;
  begins: string;
  ends: string;
}
/**
 * EventVisibility
 */
export type EventVisibility = "PRIVATE" | "PUBLIC";

/**
 * LoadCalendarEventsTriggerType
 */
export interface LoadCalendarEventsTriggerType {
  (
    userEntityId: number,
    start: string,
    end: string,
    type?: string
  ): AnyActionType;
}

/**
 * createCalendarEventTriggerType
 */
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

/**
 * updateCalendarAttendanceStatusTrigger
 */
export interface updateCalendarAttendanceStatusTrigger {
  (id: number, attendanceState: "YES" | "NO" | "MAYBE"): AnyActionType;
}
/**
 * deleteCalendarEventTriggerType
 */
export interface deleteCalendarEventTrigger {
  (id: number): AnyActionType;
}

//////State update interfaces
export interface LOAD_CALENDAR_GUIDANCE_EVENTS
  extends SpecificActionType<
    "LOAD_CALENDAR_GUIDANCE_EVENTS",
    CalendarEvent[]
  > {}
export interface UPDATE_CALENDAR_GUIDANCE_EVENT
  extends SpecificActionType<"UPDATE_CALENDAR_GUIDANCE_EVENT", CalendarEvent> {}
export interface ADD_CALENDAR_GUIDANCE_EVENT
  extends SpecificActionType<"ADD_CALENDAR_GUIDANCE_EVENT", CalendarEvent> {}
export interface DELETE_CALENDAR_GUIDANCE_EVENT
  extends SpecificActionType<
    "DELETE_CALENDAR_GUIDANCE_EVENT",
    CalendarEvent | number
  > {}
export interface UPDATE_CALENDAR_EVENTS_STATUS
  extends SpecificActionType<"UPDATE_CALENDAR_EVENTS_STATUS", EventsState> {}

/**
 * LoadCalendarEvents thunk function
 *
 * @param userEntityId
 * @param start
 * @param end
 * @param type
 */
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
          payload: <CalendarEvent[]>(
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

/**
 * createCalendarEvent thunk function
 * @param event
 */
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
      try {
        dispatch({
          type: "ADD_CALENDAR_GUIDANCE_EVENT",
          payload: <CalendarEvent>await promisify(
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

/**
 * updateCalendarEvent thunk function
 * @param event
 */
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
      try {
        dispatch({
          type: "UPDATE_CALENDAR_GUIDANCE_EVENT",
          payload: <CalendarEvent>await promisify(
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

/**
 * changeCalendarAttendanceStatus thunk function
 * @param id
 * @param attendanceState
 */
const changeCalendarAttendanceStatus: updateCalendarAttendanceStatusTrigger =
  function changeCalendarAttendanceStatus(id: number, attendanceState: string) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_CALENDAR_GUIDANCE_EVENT",
          payload: <CalendarEvent>(
            await promisify(
              mApi().calendar.event.attendance.update(id, attendanceState),
              "callback"
            )()
          ),
        });
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

/**
 * deleteCalendarEvent thunk function
 * @param id
 */
const deleteCalendarEvent: deleteCalendarEventTrigger =
  function deleteCalendarEvent(id) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        await mApi().calendar.event.del(id);

        dispatch({
          type: "DELETE_CALENDAR_GUIDANCE_EVENT",
          payload: id,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        console.log(err);
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
  changeCalendarAttendanceStatus,
  updateCalendarEvent,
  deleteCalendarEvent,
};
