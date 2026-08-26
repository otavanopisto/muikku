import { SpecificActionType, AnyActionType } from "~/actions";
import notificationActions from "~/actions/base/notifications";
import i18n from "~/locales/i18n";
import { MuikkuEvent } from "~/generated/client";
import { LoadingState } from "~/@types/shared";
import { Dispatch, Action } from "redux";
import MApi, { isMApiError } from "~/api/api";

export type EVENTS_SET_ABSENCE_EVENTS_STATE = SpecificActionType<
  "EVENTS_SET_ABSENCE_EVENTS_STATE",
  LoadingState
>;

export type EVENTS_SET_ABSENCE_EVENTS = SpecificActionType<
  "EVENTS_SET_ABSENCE_EVENTS",
  MuikkuEvent[]
>;

/**
 * SetAbsenceEventsTriggerType
 */
export interface LoadUserAbsenceEventsTriggerType {
  (userId: number): AnyActionType;
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

const removeEvent: RemoveEventTriggerType = function removeEvent(
  eventId: number
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
  ) => {
    try {
      await eventsApi.deleteEvent({ eventId });
    } catch (err) {
      if (!isMApiError(err)) {
        dispatch(notificationActions.displayNotification(err.message, "error"));
      }

      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.deleteError", {
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

const updateEvent: UpdateEventTriggerType = function updateEvent(
  eventId: number,
  event: MuikkuEvent
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
  ) => {
    try {
      await eventsApi.updateEvent({ eventId, muikkuEvent: event });
    } catch (err) {
      if (!isMApiError(err)) {
        dispatch(notificationActions.displayNotification(err.message, "error"));
      }
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.updateError", {
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

export { loadUserAbsenceEvents, removeEvent, updateUserAbsenceEvent };
