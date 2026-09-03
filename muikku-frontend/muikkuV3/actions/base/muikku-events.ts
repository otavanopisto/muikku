import { SpecificActionType, AnyActionType } from "~/actions";
import notificationActions from "~/actions/base/notifications";
import i18n from "~/locales/i18n";
import { MuikkuEvent } from "~/generated/client";
import { LoadingState } from "~/@types/shared";
import { Dispatch, Action } from "redux";
import MApi, { isMApiError } from "~/api/api";
import {
  UpdateEventPropertyRequest,
  CreateEventPropertyRequest,
  MuikkuEventProperty,
} from "~/generated/client";

export type EVENTS_SET_ABSENCE_EVENTS_STATE = SpecificActionType<
  "EVENTS_SET_ABSENCE_EVENTS_STATE",
  LoadingState
>;

export type EVENTS_SET_ABSENCE_EVENTS = SpecificActionType<
  "EVENTS_SET_ABSENCE_EVENTS",
  MuikkuEvent[]
>;

export type EVENTS_UPDATE_ABSENCE_PROPERTY = SpecificActionType<
  "EVENTS_UPDATE_ABSENCE_PROPERTY",
  MuikkuEventProperty
>;

/**
 * SetAbsenceEventsTriggerType
 */
export interface LoadUserAbsenceEventsTriggerType {
  (userId: number): AnyActionType;
}

/**
 * UpdateAbsenceEventPropertyTriggerType
 */
export interface UpdateAbsenceEventPropertyTriggerType {
  (data: UpdateEventPropertyRequest): AnyActionType;
}

/**
 * UpdateAbsenceEventPropertyTriggerType
 */
export interface CreateAbsenceEventPropertyTriggerType {
  (data: CreateEventPropertyRequest): AnyActionType;
}

const eventsApi = MApi.getEventsApi();
/**
 * loadUserAbsenceEvents
 * @param userId userId
 */
const loadUserAbsenceEvents: LoadUserAbsenceEventsTriggerType =
  function loadUserAbsenceEvents(userId: number) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
      try {
        const end = new Date();
        const start = new Date(end);
        start.setMonth(start.getMonth() - 6);

        const events = await eventsApi.listEvents({
          user: userId,
          start,
          end,
          adjustTimes: true,
          type: "ABSENCE",
        });
        dispatch({
          type: "EVENTS_SET_ABSENCE_EVENTS",
          payload: events,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          dispatch(
            notificationActions.displayNotification(err.message, "error")
          );
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "events",
              context: "absence",
              error: err instanceof Error ? err.message : "Unknown error",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * createAbsenceEventProperty thunk function
 * @param data data for creation
 */
const createAbsenceEventProperty: CreateAbsenceEventPropertyTriggerType =
  function createAbsenceEventProperty(data) {
    return async (dispatch) => {
      try {
        const property = await eventsApi.createEventProperty(data);

        dispatch({
          type: "EVENTS_UPDATE_ABSENCE_PROPERTY",
          payload: property,
        });

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createPropertySuccess", {
              ns: "events",
              context: "absence",
            }),
            "success"
          )
        );
      } catch (err) {
        if (!isMApiError(err)) {
          dispatch(
            notificationActions.displayNotification(err.message, "error")
          );
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createPropertyError", {
              ns: "events",
              context: "absence",
              error: err.message,
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * updateAbsenceEventProperty thunk function
 * @param data data for update
 */
const updateAbsenceEventProperty: UpdateAbsenceEventPropertyTriggerType =
  function updateAbsenceEventProperty(data) {
    return async (dispatch) => {
      try {
        const property = await eventsApi.updateEventProperty(data);

        dispatch({
          type: "EVENTS_UPDATE_ABSENCE_PROPERTY",
          payload: property,
        });

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updatePropertySuccess", {
              ns: "events",
              context: "absence",
            }),
            "success"
          )
        );
      } catch (err) {
        if (!isMApiError(err)) {
          return dispatch(
            notificationActions.displayNotification(err.message, "error")
          );
        }

        return dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updatePropertyError", {
              ns: "events",
              context: "absence",
              error: err.message,
            }),
            "error"
          )
        );
      }
    };
  };

export {
  loadUserAbsenceEvents,
  createAbsenceEventProperty,
  updateAbsenceEventProperty,
};
