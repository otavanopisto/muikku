import actions from "../base/notifications";
import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi, { MApiError } from "~/lib/mApi";
import { StateType } from "~/reducers";
import { EventsState, CalendarEvent } from "~/reducers/main-function/calendar";

/**
 *
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
    type: string,
    reload?: boolean
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

/**
 * Update calendar events status action type
 */
export interface UPDATE_CALENDAR_EVENTS_STATUS
  extends SpecificActionType<"UPDATE_CALENDAR_EVENTS_STATUS", EventsState> {}

/**
 * LoadCalendarEvents thunk action creator
 *
 * @param userEntityId userEntityId
 * @param start start date string
 * @param end end date string
 * @param type events type
 * @returns thunk function
 */

// TODO needs a "range" evaluation to avoid unnecessary loads

const loadCalendarEvents: LoadCalendarEventsTriggerType =
  function loadCalendarEvents(
    userEntityId: number,
    start: string,
    end: string,
    type: string,
    reload?: boolean
  ) {
    const reloadEvents = reload ? reload : false;

    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        const payload = <CalendarEvent[]>(
          await promisify(
            mApi().calendar.events.read({ userEntityId, start, end, type }),
            "callback"
          )()
        );
        dispatch({
          type: "UPDATE_CALENDAR_EVENTS_STATUS",
          payload: <EventsState>"LOADING",
        });
        if (reloadEvents) {
          // dispatch reload events
        } else {
          // dispatch load events
        }
        dispatch({
          type: "UPDATE_CALENDAR_EVENTS_STATUS",
          payload: <EventsState>"READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            getState().i18nOLD.text.get("plugin.calendar.events.load.error"),
            "error"
          )
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
 * @param event event object
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
        // Dispatch create event
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            getState().i18nOLD.text.get("plugin.calendar.events.create.error"),
            "error"
          )
        );
      }
    };
  };

/**
 * updateCalendarEvent thunk function
 * @param event calendar event
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
        // Dispatch update event
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            getState().i18nOLD.text.get("plugin.calendar.events.update.error"),
            "error"
          )
        );
      }
    };
  };

/**
 * changeCalendarAttendanceStatus thunk function
 * @param id user id
 * @param attendanceState new attendance state
 */
const changeCalendarAttendanceStatus: updateCalendarAttendanceStatusTrigger =
  function changeCalendarAttendanceStatus(id: number, attendanceState: string) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        // Dispatch change attendance
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            getState().i18nOLD.text.get(
              "plugin.calendar.events.attendance.error"
            ),
            "error"
          )
        );
      }
    };
  };

/**
 * deleteCalendarEvent thunk function
 * @param id event id
 */
const deleteCalendarEvent: deleteCalendarEventTrigger =
  function deleteCalendarEvent(id) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        await mApi().calendar.event.del(id);

        // Dispatch delete
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            getState().i18nOLD.text.get("plugin.calendar.events.delete.error"),
            "error"
          )
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
